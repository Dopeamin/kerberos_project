import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { crypt, decrypt } from './utils/crypto';

@Injectable()
export class AppService {
  getHello(encUserAuthenticator: string, encServiceTicket: string) {
    // decrypting service ticket
    const ServiceTicketStr = decrypt(
      process.env.SERVICE_SECRET,
      encServiceTicket,
    );

    if (!ServiceTicketStr)
      throw new HttpException(
        'Could not decrypt the sercit ticket',
        HttpStatus.UNAUTHORIZED,
      );

    const serviceTicket = JSON.parse(ServiceTicketStr);
    console.log(serviceTicket);

    // decrypt user authenticator
    const serviceSessionKey = serviceTicket.serviceSessionKey;

    const userAuthStr = decrypt(serviceSessionKey, encUserAuthenticator);

    if (!userAuthStr)
      throw new HttpException(
        'Could not decrypt the userAuth',
        HttpStatus.UNAUTHORIZED,
      );

    const userAuthenticator = JSON.parse(userAuthStr);

    // verifications
    if (userAuthenticator.username !== serviceTicket.username)
      throw new HttpException(
        'ticket does not belong to user',
        HttpStatus.UNAUTHORIZED,
      );

    //preparing service authenticator
    const serviceAuthenticator = {
      serviceName: 'chatgpt-server',
      timestamp: Date.now(),
    };

    //encrypting service authenticator
    const encServiceAuthenticator = crypt(
      serviceSessionKey,
      JSON.stringify(serviceAuthenticator),
    );

    return { encServiceAuthenticator };
  }
}

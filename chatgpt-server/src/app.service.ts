import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decrypt } from './utils/crypto';

@Injectable()
export class AppService {
  getHello(encUserAuthenticator: string, encServiceTicket: string): string {
    console.log(encUserAuthenticator, encServiceTicket);
    console.log(process.env.SERVICE_SECRET);

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

    return serviceTicket;
  }
}

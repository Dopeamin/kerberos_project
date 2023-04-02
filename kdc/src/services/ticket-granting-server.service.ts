import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import services from 'src/constants/services';
import { KeyGenService } from './key-gen.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TicketGrantingServerService {
  constructor(private readonly keygen: KeyGenService) {}

  getTicket(enctgt, fortgs, encUserAuthenticator) {
    const service = services[fortgs.serviceName];
    if (!service)
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);

    // decrypting ticket granting ticket
    const secret_key = process.env.TICKET_GRANTING_SERVER_SECRET;
    const tgt = JSON.parse(this.keygen.decrypt(secret_key, enctgt));

    const tgsSessionKey = tgt.tgsSessionKey;
    // decrypting user authenticator
    const userAuthenticator = JSON.parse(
      this.keygen.decrypt(tgsSessionKey, encUserAuthenticator),
    );

    // verify
    if (tgt.username !== userAuthenticator.username)
      throw new HttpException(
        'Ticket is for another user',
        HttpStatus.CONFLICT,
      );

    // preparing messages
    const serviceSessionKey = uuid();
    const forClient = {
      serviceUrl: service.url,
      timestamp: Date.now(),
      lifetime: tgt.lifetime,
      serviceSessionKey,
    };

    const serviceTicket = {
      username: userAuthenticator.username,
      serviceName: fortgs.serviceName,
      timestamp: Date.now(),
      userIp: tgt.userIp,
      lifetimeServiceTicket: tgt.lifetime,
      serviceSessionKey,
    };

    // encrypting messages
    const encForClient = this.keygen.crypt(
      tgsSessionKey,
      JSON.stringify(forClient),
    );
    const encServiceTicket = this.keygen.crypt(
      service.serviceSecret,
      JSON.stringify(serviceTicket),
    );

    return { encForClient, encServiceTicket };
  }
}

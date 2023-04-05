import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { decrypt } from 'src/utils/crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // if method is public run it
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (isPublic) return true;

    // else verify kerberos ticket
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.log('missing auth header');
      return false;
    }
    const parts = authHeader.split(' ');

    if (parts[0] !== 'Kerberos') {
      console.log('not a kerberos token');
      return false;
    }
    const encServiceTicket = parts[1];
    const encUserAuthenticator = parts[2];

    if (!encServiceTicket || !encUserAuthenticator) {
      console.log('token missing attributes');
      return false;
    }

    // decrypting service ticket
    const ServiceTicketStr = decrypt(
      process.env.SERVICE_SECRET,
      encServiceTicket,
    );
    if (!ServiceTicketStr) {
      console.log('unable to decyprt service ticket');
      return false;
    }
    const serviceTicket = JSON.parse(ServiceTicketStr);

    // decrypt user authenticator
    const serviceSessionKey = serviceTicket.serviceSessionKey;
    const userAuthStr = decrypt(serviceSessionKey, encUserAuthenticator);
    if (!userAuthStr) {
      console.log('unable to decyprt the user authenticator');
      return false;
    }
    const userAuthenticator = JSON.parse(userAuthStr);

    // verifying username
    if (userAuthenticator.username !== serviceTicket.username) {
      console.log('usernames do not match');
      return false;
    }

    //verifying expiration
    const lifetimeServiceTicket = serviceTicket.lifetimeServiceTicket;
    const ticketTimestamp = serviceTicket.timestamp;
    const expirtationDate = lifetimeServiceTicket + ticketTimestamp;
    if (Date.now() >= expirtationDate) {
      console.log('service ticket expired');
      return false;
    }

    // verifying lifetime
    // if(userA)

    return true;
  }
}

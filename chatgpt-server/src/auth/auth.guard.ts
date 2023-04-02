import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['Authorization'];
    console.log(authHeader);

    return false;
  }

  validate(encUserAuthenticator: string, encServiceTicket: string) {}
}

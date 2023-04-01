import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signup')
  postSignup(@Body() body) {
    const { username, password } = body;
    return this.appService.signup(username, password);
  }

  @Post('ticket-granting-ticket')
  postTicket(@Body() body, @Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const { username, serviceName, lifetime } = body;
    return this.appService.ticketGrantingTicket(
      username,
      serviceName,
      ip,
      lifetime,
    );
  }
}

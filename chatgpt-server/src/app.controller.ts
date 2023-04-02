import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() body) {
    const { encUserAuthenticator, encServiceTicket } = body;
    return this.appService.getHello(encUserAuthenticator, encServiceTicket);
  }
}

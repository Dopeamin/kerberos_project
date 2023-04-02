import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post()
  getHello(@Body() body) {
    const { encUserAuthenticator, encServiceTicket } = body;
    return this.appService.getHello(encUserAuthenticator, encServiceTicket);
  }
}

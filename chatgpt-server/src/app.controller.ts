import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { OpenaiService } from './openai/openai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Public()
  @Post()
  getHello(@Body() body) {
    const { encUserAuthenticator, encServiceTicket } = body;
    return this.appService.getHello(encUserAuthenticator, encServiceTicket);
  }

  @Post('answer')
  async getAnswer(@Body() body) {
    const { question } = body;

    return await this.openaiService.createCompletion(question);
  }

  @Get('test-auth')
  test() {
    return 'test passed';
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { TicketGrantingServerService } from 'src/services/ticket-granting-server.service';

@Controller('ticket-granting-server')
export class TicketGrantingServerController {
  constructor(private readonly ticketService: TicketGrantingServerService) {}

  @Post()
  getTicket(@Body() body) {
    const { enctgt, fortgs, encUserAuthenticator } = body;
    return this.ticketService.getTicket(enctgt, fortgs, encUserAuthenticator);
  }
}

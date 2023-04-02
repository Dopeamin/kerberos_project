import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { KeyGenService } from './services/key-gen.service';
import Lifetime from './enums/Lifetime.enum';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
    private keygen: KeyGenService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signup(username: string, password: string) {
    const similarUser = await this.users.findOneBy({ username });
    if (similarUser) {
      console.log(similarUser);
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const secret_key = this.keygen.generateUserSecretKey(password, username);
    const user = this.users.create({ username, secret_key });
    this.users.save(user);
    return user;
  }

  async ticketGrantingTicket(
    username: string,
    serviceName: string,
    ip: string | string[],
    lifetime: Lifetime,
  ) {
    const user = await this.users.findOneBy({ username });
    if (!user)
      throw new HttpException('Username does not exist', HttpStatus.NOT_FOUND);

    // preparing messages
    const tgsSessionKey = uuid();
    const forClient = {
      tgsUrl: process.env.TICKET_GRANTING_SERVER_URL,
      timestamp: Date.now(),
      lifetime,
      tgsSessionKey,
    };
    const tgt = {
      username,
      tgsUrl: process.env.TICKET_GRANTING_SERVER_URL,
      timestamp: Date.now(),
      userIp: ip,
      lifetime,
      tgsSessionKey,
    };

    const encForClient = this.keygen.crypt(
      user.secret_key,
      JSON.stringify(forClient),
    );

    const enctgt = this.keygen.crypt(
      process.env.TICKET_GRANTING_SERVER_SECRET,
      JSON.stringify(tgt),
    );

    return {
      encForClient,
      enctgt,
    };
  }
}

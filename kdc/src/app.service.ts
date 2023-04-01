import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { KeyGenService } from './services/key-gen.service';

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
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyGenService } from './services/key-gen.service';
import { User } from './entities/user.entity';
import { TicketGrantingServerController } from './controllers/ticket-granting-server.controller';
import { TicketGrantingServerService } from './services/ticket-granting-server.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'db',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, TicketGrantingServerController, UserController],
  providers: [
    AppService,
    KeyGenService,
    TicketGrantingServerService,
    UserService,
  ],
})
export class AppModule {}

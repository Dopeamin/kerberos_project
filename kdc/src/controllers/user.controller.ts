import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userServce: UserService) {}

  @Post()
  async whoAmI(@Body() body) {
    const { username } = body;
    return (await this.userServce.whoAmI(username))?.username;
  }
}

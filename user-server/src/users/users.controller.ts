import { Controller, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators';
import { PublicUser, toPublicUser } from './public-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async list(): Promise<PublicUser[]> {
    const users = await this.usersService.findAll();
    return users.map(toPublicUser);
  }
}

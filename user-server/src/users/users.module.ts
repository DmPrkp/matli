import { Module } from '@nestjs/common';
import { DefaultAdminService } from './default-admin.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DefaultAdminService],
  exports: [UsersService],
})
export class UsersModule {}

import { IsNotEmpty, IsString } from 'class-validator';
import { IsNewPassword } from './validators';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsNewPassword()
  newPassword!: string;
}

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IsNewPassword, normalizeLogin, trim } from './validators';

export class RegisterDto {
  @Transform(normalizeLogin)
  @IsString()
  @Matches(/^[a-z0-9._-]{3,32}$/, {
    message: 'login must be 3-32 characters long: latin letters, digits, ".", "_" or "-"',
  })
  login!: string;

  @IsNewPassword()
  password!: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  lastName?: string;
}

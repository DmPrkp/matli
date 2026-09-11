import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { normalizeLogin } from './validators';

// Без правил формата: они для регистрации, а на входе лишь подсказали бы, какой логин невозможен.
export class LoginDto {
  @Transform(normalizeLogin)
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

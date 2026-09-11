import { applyDecorators } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const trim = ({ value }: TransformFnParams) => (typeof value === 'string' ? value.trim() : value);

// Логин без учёта регистра: «Admin» и «admin» — один пользователь. Иначе при входе
// легко промахнуться, а при регистрации — завести двойника.
export const normalizeLogin = ({ value }: TransformFnParams) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

// Верхняя граница не для красоты: bcrypt молча отбрасывает всё дальше 72 байт.
export const IsNewPassword = () => applyDecorators(IsString(), MinLength(6), MaxLength(72));

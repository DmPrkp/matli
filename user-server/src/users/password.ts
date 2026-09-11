import { compare, hash, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';

const BCRYPT_ROUNDS = 10;

// Для несуществующего логина всё равно гоняем bcrypt: иначе «нет такого пользователя»
// отвечает заметно быстрее «неверного пароля», и занятые логины перебираются по времени.
const DUMMY_HASH = hashSync(randomBytes(16).toString('hex'), BCRYPT_ROUNDS);

export function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, passwordHash: string | undefined): Promise<boolean> {
  return compare(password, passwordHash ?? DUMMY_HASH);
}

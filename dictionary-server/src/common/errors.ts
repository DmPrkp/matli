import { ConflictException } from '@nestjs/common';

/**
 * Позицию справочника нельзя снести физически, пока на неё что-то ссылается.
 *
 * ВАЖНО: проверяются только ссылки ВНУТРИ базы словаря. Нормы расхода живут в
 * calc-server и в другой базе — межбазовых FK в Postgres нет, так что отсюда их
 * не видно. Поэтому дефолт — мягкое удаление, а hard delete нужно запрашивать явно.
 */
export class ResourceInUseException extends ConflictException {
  constructor(blockedBy: Record<string, number>) {
    super({
      error: 'resource_in_use',
      message: 'Позиция используется и не может быть удалена физически',
      blockedBy,
      hint: 'Удалите без ?hard=true — позиция будет помечена архивной (is_active = false)',
    });
  }
}

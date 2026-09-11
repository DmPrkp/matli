import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { paramKinds, paramValues, units } from '~/db/schema';
import { listQuerySchema } from '~/common/pagination';

/** Поля, которыми управляет БД, а не клиент. */
const managed = { id: true, isActive: true, createdAt: true, updatedAt: true } as const;

/* ------------------------------------------------------------------ units */

export const createUnitSchema = createInsertSchema(units, {
  code: (s) => s.min(1).max(16).regex(/^[a-z0-9]+$/, 'только строчные латинские буквы и цифры'),
  nameRu: (s) => s.min(1),
  nameEn: (s) => s.min(1),
}).omit(managed);
export const updateUnitSchema = createUnitSchema.partial();

export class CreateUnitDto extends createZodDto(createUnitSchema) {}
export class UpdateUnitDto extends createZodDto(updateUnitSchema) {}

/* ------------------------------------------------------------- param kinds */

export const createParamKindSchema = createInsertSchema(paramKinds, {
  code: (s) => s.min(1).max(32).regex(/^[a-z_]+$/, 'только строчные латинские буквы и подчёркивание'),
  nameRu: (s) => s.min(1),
  nameEn: (s) => s.min(1),
}).omit(managed);
export const updateParamKindSchema = createParamKindSchema.partial();

export class CreateParamKindDto extends createZodDto(createParamKindSchema) {}
export class UpdateParamKindDto extends createZodDto(updateParamKindSchema) {}

/* ------------------------------------------------------------ param values */

export const createParamValueSchema = createInsertSchema(paramValues, {
  // numeric приезжает из pg строкой — принимаем число и приводим сами
  value: () => z.coerce.number().finite(),
  unitId: (s) => s.int().positive(),
})
  .omit(managed)
  .extend({ value: z.coerce.number().finite() });
export const updateParamValueSchema = createParamValueSchema.partial();

export class CreateParamValueDto extends createZodDto(createParamValueSchema) {}
export class UpdateParamValueDto extends createZodDto(updateParamValueSchema) {}

export const paramValueQuerySchema = listQuerySchema.extend({
  unitId: z.coerce.number().int().positive().optional(),
});
export class ParamValueQueryDto extends createZodDto(paramValueQuerySchema) {}

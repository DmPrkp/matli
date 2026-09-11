import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { listQuerySchema } from '~/common/pagination';
import { handTools, materialTypes, materials, powerTools } from '~/db/schema';

const managed = { id: true, isActive: true, createdAt: true, updatedAt: true } as const;

/* ------------------------------------------------------------- hand tools */

export const createHandToolSchema = createInsertSchema(handTools, {
  nameRu: (s) => s.min(1).max(100),
  nameEn: (s) => s.min(1).max(100),
}).omit(managed);
export const updateHandToolSchema = createHandToolSchema.partial();

export class CreateHandToolDto extends createZodDto(createHandToolSchema) {}
export class UpdateHandToolDto extends createZodDto(updateHandToolSchema) {}

/* ------------------------------------------------------------ power tools */

export const createPowerToolSchema = createInsertSchema(powerTools, {
  nameRu: (s) => s.min(1).max(100),
  nameEn: (s) => s.min(1).max(100),
}).omit(managed);
export const updatePowerToolSchema = createPowerToolSchema.partial();

export class CreatePowerToolDto extends createZodDto(createPowerToolSchema) {}
export class UpdatePowerToolDto extends createZodDto(updatePowerToolSchema) {}

/* --------------------------------------------------------- material types */

export const createMaterialTypeSchema = createInsertSchema(materialTypes, {
  code: (s) => s.min(1).max(32).regex(/^[a-z_]+$/, 'только строчные латинские буквы и подчёркивание'),
  nameRu: (s) => s.min(1).max(100),
  nameEn: (s) => s.min(1).max(100),
}).omit(managed);
export const updateMaterialTypeSchema = createMaterialTypeSchema.partial();

export class CreateMaterialTypeDto extends createZodDto(createMaterialTypeSchema) {}
export class UpdateMaterialTypeDto extends createZodDto(updateMaterialTypeSchema) {}

/* -------------------------------------------------------------- materials */

export const createMaterialSchema = createInsertSchema(materials, {
  nameRu: (s) => s.min(1).max(150),
  nameEn: (s) => s.min(1).max(150),
  unitId: (s) => s.int().positive(),
}).omit(managed);
export const updateMaterialSchema = createMaterialSchema.partial();

export class CreateMaterialDto extends createZodDto(createMaterialSchema) {}
export class UpdateMaterialDto extends createZodDto(updateMaterialSchema) {}

export const materialQuerySchema = listQuerySchema.extend({
  unitId: z.coerce.number().int().positive().optional(),
  typeId: z.coerce.number().int().positive().optional(),
  /** true — только материалы без проставленного типа. */
  untyped: z.coerce.boolean().optional(),
});
export class MaterialQueryDto extends createZodDto(materialQuerySchema) {}

/* --------------------------------------------------------------- варианты */

/**
 * Вариант — конкретный типоразмер позиции: дюбель Ø8 × 226 мм, рулетка 5 м.
 * `code` не принимаем: он собирается из id позиции и параметров, как в сидах.
 */
export const createVariantSchema = z.object({
  /**
   * Может быть пустым: у позиции без типоразмеров ровно один вариант, и его
   * code — это просто id позиции ('1', '7', '90'). В исходном справочнике
   * таких вариантов 22 из 100 у материалов и 26 из 100 у ручного инструмента.
   *
   * Вид параметра здесь не передаётся — он задан у самого значения.
   */
  paramValueIds: z.array(z.number().int().positive()).default([]),
});
export class CreateVariantDto extends createZodDto(createVariantSchema) {}

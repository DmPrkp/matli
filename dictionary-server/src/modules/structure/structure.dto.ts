import { createZodDto } from 'nestjs-zod';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { listQuerySchema } from '~/common/pagination';
import { systems, workStages } from '~/db/schema';

const managed = { id: true, isActive: true, createdAt: true, updatedAt: true } as const;

export const createSystemSchema = createInsertSchema(systems, {
  title: (s) => s.min(1).max(50),
  description: (s) => s.max(200),
}).omit(managed);
export const updateSystemSchema = createSystemSchema.partial();

export class CreateSystemDto extends createZodDto(createSystemSchema) {}
export class UpdateSystemDto extends createZodDto(updateSystemSchema) {}

export const createWorkStageSchema = createInsertSchema(workStages, {
  title: (s) => s.min(1).max(50),
  position: (s) => s.int().min(1),
  systemId: (s) => s.int().positive(),
}).omit(managed);
export const updateWorkStageSchema = createWorkStageSchema.partial();

export class CreateWorkStageDto extends createZodDto(createWorkStageSchema) {}
export class UpdateWorkStageDto extends createZodDto(updateWorkStageSchema) {}

export const workStageQuerySchema = listQuerySchema.extend({
  systemId: z.coerce.number().int().positive().optional(),
});
export class WorkStageQueryDto extends createZodDto(workStageQuerySchema) {}

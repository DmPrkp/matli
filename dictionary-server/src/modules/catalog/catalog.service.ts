import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, eq, inArray, isNull } from 'drizzle-orm';
import type { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';

import { CrudService } from '~/common/crud.service';
import type { ListQuery } from '~/common/pagination';
import { toPage, type Page } from '~/common/pagination';
import { DB, type Database } from '~/db/db.module';
import {
  handToolVariants,
  handTools,
  materialTypes,
  materialVariants,
  materials,
  powerTools,
  units,
} from '~/db/schema';
import type { MaterialQueryDto } from './catalog.dto';

/**
 * Сколько типоразмеров у каждой позиции страницы.
 *
 * Одним запросом на страницу, а не N подзапросами: клиенту счётчик нужен, чтобы
 * не рисовать раскрывающую стрелку у позиций, у которых разворачивать нечего.
 * Считаем все варианты, а не только активные, — ровно те, что вернёт
 * VariantsService.listByOwner(), иначе стрелка и содержимое разошлись бы.
 */
async function countVariants(
  db: Database,
  variants: PgTableWithColumns<any>,
  ownerColumn: PgColumn<any>,
  ids: number[],
): Promise<Record<number, number>> {
  if (ids.length === 0) return {};

  const rows = await db
    .select({ ownerId: ownerColumn, value: count() })
    .from(variants)
    .where(inArray(ownerColumn, ids))
    .groupBy(ownerColumn);

  return Object.fromEntries(rows.map((row) => [Number(row.ownerId), Number(row.value)]));
}

@Injectable()
export class HandToolsService extends CrudService<typeof handTools.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, handTools, [handTools.nameRu, handTools.nameEn], handTools.nameRu, [
      { label: 'variants', table: handToolVariants, column: handToolVariants.handToolId },
    ]);
  }

  /** Тот же список, что и у базового CRUD, плюс число типоразмеров у позиции. */
  async listWithVariantCount(query: ListQuery): Promise<Page<Record<string, unknown>>> {
    const page = await this.list(query);
    const counts = await countVariants(
      this.db,
      handToolVariants,
      handToolVariants.handToolId,
      page.items.map((item) => item.id),
    );

    return {
      ...page,
      items: page.items.map((item) => ({ ...item, variantsCount: counts[item.id] ?? 0 })),
    };
  }
}

@Injectable()
export class PowerToolsService extends CrudService<typeof powerTools.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, powerTools, [powerTools.nameRu, powerTools.nameEn], powerTools.nameRu, []);
  }
}

@Injectable()
export class MaterialTypesService extends CrudService<typeof materialTypes.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, materialTypes, [materialTypes.code, materialTypes.nameRu, materialTypes.nameEn], materialTypes.nameRu, [
      { label: 'materials', table: materials, column: materials.typeId },
    ]);
  }
}

@Injectable()
export class MaterialsService extends CrudService<typeof materials.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, materials, [materials.nameRu, materials.nameEn], materials.nameRu, [
      { label: 'variants', table: materialVariants, column: materialVariants.materialId },
    ]);
  }

  /** Материал без единицы измерения нечитаем — подмешиваем её и тип в список. */
  async listWithUnit(query: MaterialQueryDto): Promise<Page<Record<string, unknown>>> {
    const where = and(
      this.stateFilter(query.state),
      this.searchFilter(query.q),
      query.unitId ? eq(materials.unitId, query.unitId) : undefined,
      query.typeId ? eq(materials.typeId, query.typeId) : undefined,
      query.untyped ? isNull(materials.typeId) : undefined,
    );

    const [items, [totals]] = await Promise.all([
      this.db
        .select({
          id: materials.id,
          nameRu: materials.nameRu,
          nameEn: materials.nameEn,
          descriptionRu: materials.descriptionRu,
          descriptionEn: materials.descriptionEn,
          isActive: materials.isActive,
          unit: { id: units.id, code: units.code, nameRu: units.nameRu, nameEn: units.nameEn },
          // Тип необязателен — оставляем LEFT JOIN, иначе материалы без типа выпадут
          type: {
            id: materialTypes.id,
            code: materialTypes.code,
            nameRu: materialTypes.nameRu,
            nameEn: materialTypes.nameEn,
          },
        })
        .from(materials)
        .innerJoin(units, eq(materials.unitId, units.id))
        .leftJoin(materialTypes, eq(materials.typeId, materialTypes.id))
        .where(where)
        .orderBy(asc(materials.nameRu))
        .limit(query.limit)
        .offset((query.page - 1) * query.limit),
      this.db.select({ value: count() }).from(materials).where(where),
    ]);

    const counts = await countVariants(
      this.db,
      materialVariants,
      materialVariants.materialId,
      items.map((item) => item.id),
    );

    return toPage(
      items.map((item) => ({ ...item, variantsCount: counts[item.id] ?? 0 })),
      Number(totals?.value ?? 0),
      query,
    );
  }
}

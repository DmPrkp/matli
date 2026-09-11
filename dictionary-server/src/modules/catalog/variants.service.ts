import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq, inArray } from 'drizzle-orm';
import type { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';

import { DB, type Database } from '~/db/db.module';
import {
  handToolVariantParams,
  handToolVariants,
  handTools,
  materialVariantParams,
  materialVariants,
  materials,
  paramKinds,
  paramValues,
  units,
} from '~/db/schema';
import type { CreateVariantDto } from './catalog.dto';
import { buildVariantCode } from './variant-code';

export type VariantParam = {
  paramValueId: number;
  value: string;
  unit: string;
  kind: string | null;
};

export type Variant = {
  id: number;
  code: string;
  ownerId: number;
  isActive: boolean;
  params: VariantParam[];
};

type VariantTables = {
  variants: PgTableWithColumns<any>;
  variantId: PgColumn<any>;
  variantCode: PgColumn<any>;
  variantOwner: PgColumn<any>;
  variantActive: PgColumn<any>;
  links: PgTableWithColumns<any>;
  linkVariantId: PgColumn<any>;
  linkParamValueId: PgColumn<any>;
  /** Имя поля-владельца в drizzle-модели — для insert(). */
  ownerKey: 'handToolId' | 'materialId';
  /** Таблица самой позиции — чтобы проверить, что владелец существует. */
  owner: PgTableWithColumns<any>;
  ownerId: PgColumn<any>;
  ownerLabel: string;
};

const HAND_TOOL: VariantTables = {
  variants: handToolVariants,
  variantId: handToolVariants.id,
  variantCode: handToolVariants.code,
  variantOwner: handToolVariants.handToolId,
  variantActive: handToolVariants.isActive,
  links: handToolVariantParams,
  linkVariantId: handToolVariantParams.variantId,
  linkParamValueId: handToolVariantParams.paramValueId,
  ownerKey: 'handToolId',
  owner: handTools,
  ownerId: handTools.id,
  ownerLabel: 'Инструмент',
};

const MATERIAL: VariantTables = {
  variants: materialVariants,
  variantId: materialVariants.id,
  variantCode: materialVariants.code,
  variantOwner: materialVariants.materialId,
  variantActive: materialVariants.isActive,
  links: materialVariantParams,
  linkVariantId: materialVariantParams.variantId,
  linkParamValueId: materialVariantParams.paramValueId,
  ownerKey: 'materialId',
  owner: materials,
  ownerId: materials.id,
  ownerLabel: 'Материал',
};

@Injectable()
export class VariantsService {
  constructor(@Inject(DB) private readonly db: Database) {}

  private tables(kind: 'hand-tool' | 'material'): VariantTables {
    return kind === 'hand-tool' ? HAND_TOOL : MATERIAL;
  }

  async listByOwner(kind: 'hand-tool' | 'material', ownerId: number): Promise<Variant[]> {
    const t = this.tables(kind);

    const rows = await this.db
      .select({
        id: t.variantId,
        code: t.variantCode,
        ownerId: t.variantOwner,
        isActive: t.variantActive,
        paramValueId: t.linkParamValueId,
        value: paramValues.value,
        unit: units.code,
        kind: paramKinds.code,
      })
      .from(t.variants)
      .leftJoin(t.links, eq(t.linkVariantId, t.variantId))
      .leftJoin(paramValues, eq(paramValues.id, t.linkParamValueId))
      .leftJoin(units, eq(units.id, paramValues.unitId))
      .leftJoin(paramKinds, eq(paramKinds.id, paramValues.kindId))
      .where(eq(t.variantOwner, ownerId))
      // Вторичная сортировка обязательна: без неё параметры внутри варианта
      // приходили в произвольном порядке и «Ø 8 мм × дл. 100 мм» иногда
      // читалось наоборот. По id значения порядок совпадает с тем, что зашит
      // в code варианта (диаметры имеют меньшие id, чем длины).
      .orderBy(asc(t.variantId), asc(t.linkParamValueId));

    const byId = new Map<number, Variant>();

    for (const row of rows) {
      let variant = byId.get(row.id);
      if (!variant) {
        variant = { id: row.id, code: row.code, ownerId: row.ownerId, isActive: row.isActive, params: [] };
        byId.set(row.id, variant);
      }
      if (row.paramValueId !== null && row.value !== null) {
        variant.params.push({
          paramValueId: row.paramValueId,
          value: row.value,
          unit: row.unit ?? '',
          kind: row.kind,
        });
      }
    }

    return [...byId.values()];
  }

  async create(kind: 'hand-tool' | 'material', ownerId: number, dto: CreateVariantDto): Promise<Variant> {
    const t = this.tables(kind);

    // Без этого несуществующий владелец давал 500 с сырой ошибкой FK от Postgres.
    const [owner] = await this.db.select({ id: t.ownerId }).from(t.owner).where(eq(t.ownerId, ownerId)).limit(1);
    if (!owner) throw new NotFoundException(`${t.ownerLabel} ${ownerId} не найден`);

    const paramValueIds = dto.paramValueIds;

    if (new Set(paramValueIds).size !== paramValueIds.length) {
      throw new BadRequestException('Один и тот же параметр указан дважды');
    }

    if (paramValueIds.length > 0) {
      const known = await this.db
        .select({ id: paramValues.id })
        .from(paramValues)
        .where(inArray(paramValues.id, paramValueIds));

      if (known.length !== paramValueIds.length) {
        const missing = paramValueIds.filter((id) => !known.some((k) => k.id === id));
        throw new BadRequestException(`Значения параметров не найдены: ${missing.join(', ')}`);
      }
    }

    const code = buildVariantCode(ownerId, paramValueIds);

    const [existing] = await this.db
      .select({ id: t.variantId })
      .from(t.variants)
      .where(eq(t.variantCode, code))
      .limit(1);

    if (existing) {
      throw new ConflictException(`Такой вариант уже есть: ${code} (id ${existing.id})`);
    }

    return this.db.transaction(async (tx) => {
      const [variant] = await tx
        .insert(t.variants)
        .values({ code, [t.ownerKey]: ownerId })
        .returning();

      if (paramValueIds.length > 0) {
        await tx
          .insert(t.links)
          .values(paramValueIds.map((paramValueId) => ({ variantId: variant.id, paramValueId })));
      }

      return { id: variant.id, code, ownerId, isActive: true, params: [] } satisfies Variant;
    });
  }

  async archive(kind: 'hand-tool' | 'material', variantId: number): Promise<void> {
    const t = this.tables(kind);
    const result = await this.db
      .update(t.variants)
      .set({ isActive: false })
      .where(eq(t.variantId, variantId))
      .returning({ id: t.variantId });

    if (result.length === 0) throw new NotFoundException(`Вариант ${variantId} не найден`);
  }

  /**
   * Физическое удаление варианта. Связки параметров уходят каскадом, но нормы
   * расхода в calc-server ссылаются на variant_id из другой базы — проверить
   * их отсюда невозможно, поэтому по умолчанию используется archive().
   */
  async remove(kind: 'hand-tool' | 'material', variantId: number): Promise<void> {
    const t = this.tables(kind);
    const result = await this.db
      .delete(t.variants)
      .where(eq(t.variantId, variantId))
      .returning({ id: t.variantId });

    if (result.length === 0) throw new NotFoundException(`Вариант ${variantId} не найден`);
  }
}

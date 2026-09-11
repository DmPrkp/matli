import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq } from 'drizzle-orm';

import { CrudService } from '~/common/crud.service';
import { toPage, type Page } from '~/common/pagination';
import { DB, type Database } from '~/db/db.module';
import { systems, workStages } from '~/db/schema';
import type { WorkStageQueryDto } from './structure.dto';

@Injectable()
export class SystemsService extends CrudService<typeof systems.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, systems, [systems.title, systems.description], systems.title, [
      { label: 'workStages', table: workStages, column: workStages.systemId },
    ]);
  }

  /** Раньше это жило в calc-server: GET /:workType/:system по названию системы. */
  async stagesBySystemTitle(title: string): Promise<(typeof workStages.$inferSelect)[]> {
    const [system] = await this.db.select().from(systems).where(eq(systems.title, title)).limit(1);
    if (!system) throw new NotFoundException(`Система «${title}» не найдена`);

    return this.db
      .select()
      .from(workStages)
      .where(and(eq(workStages.systemId, system.id), eq(workStages.isActive, true)))
      .orderBy(asc(workStages.position));
  }
}

@Injectable()
export class WorkStagesService extends CrudService<typeof workStages.$inferSelect> {
  constructor(@Inject(DB) db: Database) {
    super(db, workStages, [workStages.title], workStages.position, []);
  }

  async listBySystem(query: WorkStageQueryDto): Promise<Page<typeof workStages.$inferSelect>> {
    const where = and(
      this.stateFilter(query.state),
      this.searchFilter(query.q),
      query.systemId ? eq(workStages.systemId, query.systemId) : undefined,
    );

    const [items, [totals]] = await Promise.all([
      this.db
        .select()
        .from(workStages)
        .where(where)
        .orderBy(asc(workStages.systemId), asc(workStages.position))
        .limit(query.limit)
        .offset((query.page - 1) * query.limit),
      this.db.select({ value: count() }).from(workStages).where(where),
    ]);

    return toPage(items, Number(totals?.value ?? 0), query);
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { createDictionaryController } from '~/common/dictionary.controller';
import {
  CreateSystemDto,
  CreateWorkStageDto,
  UpdateSystemDto,
  UpdateWorkStageDto,
  WorkStageQueryDto,
  createSystemSchema,
  createWorkStageSchema,
  updateSystemSchema,
  updateWorkStageSchema,
} from './structure.dto';
import { SystemsService, WorkStagesService } from './structure.service';

@ApiTags('systems')
@Controller('systems')
export class SystemsController extends createDictionaryController({
  summary: 'Системы работ: EIFS, frame_scaffold',
  createSchema: createSystemSchema,
  updateSchema: updateSystemSchema,
  createDto: CreateSystemDto,
  updateDto: UpdateSystemDto,
}) {
  constructor(protected readonly service: SystemsService) {
    super();
  }

  @Get(':id/work-stages')
  @ApiOperation({ summary: 'Этапы работ системы, по порядку' })
  stagesById(@Param('id', ParseIntPipe) id: number) {
    return this.service.byId(id).then(({ title }) => this.service.stagesBySystemTitle(title));
  }
}

@ApiTags('work-stages')
@Controller('work-stages')
export class WorkStagesController extends createDictionaryController({
  summary: 'Этапы работ (бывш. components). position — порядок слоя в системе',
  createSchema: createWorkStageSchema,
  updateSchema: updateWorkStageSchema,
  createDto: CreateWorkStageDto,
  updateDto: UpdateWorkStageDto,
}) {
  constructor(protected readonly service: WorkStagesService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Этапы работ, с фильтром по системе' })
  @ApiParam({ name: 'systemId', required: false })
  override list(@Query() query: WorkStageQueryDto) {
    return this.service.listBySystem(query);
  }
}

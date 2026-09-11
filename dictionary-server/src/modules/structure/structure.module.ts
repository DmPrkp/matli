import { Module } from '@nestjs/common';

import { SystemsController, WorkStagesController } from './structure.controller';
import { SystemsService, WorkStagesService } from './structure.service';

@Module({
  controllers: [SystemsController, WorkStagesController],
  providers: [SystemsService, WorkStagesService],
  exports: [SystemsService, WorkStagesService],
})
export class StructureModule {}

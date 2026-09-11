import { Module } from '@nestjs/common';

import {
  HandToolsController,
  MaterialTypesController,
  MaterialsController,
  PowerToolsController,
} from './catalog.controller';
import {
  HandToolsService,
  MaterialTypesService,
  MaterialsService,
  PowerToolsService,
} from './catalog.service';
import { HandToolVariantsController, MaterialVariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

@Module({
  controllers: [
    HandToolsController,
    PowerToolsController,
    MaterialTypesController,
    MaterialsController,
    HandToolVariantsController,
    MaterialVariantsController,
  ],
  providers: [
    HandToolsService,
    PowerToolsService,
    MaterialTypesService,
    MaterialsService,
    VariantsService,
  ],
  exports: [
    HandToolsService,
    PowerToolsService,
    MaterialTypesService,
    MaterialsService,
    VariantsService,
  ],
})
export class CatalogModule {}

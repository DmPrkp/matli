import { Module } from '@nestjs/common';

import {
  ParamKindsController,
  ParamValuesController,
  UnitsController,
} from './params.controller';
import { ParamKindsService, ParamValuesService, UnitsService } from './params.service';

@Module({
  controllers: [UnitsController, ParamKindsController, ParamValuesController],
  providers: [UnitsService, ParamKindsService, ParamValuesService],
  exports: [UnitsService, ParamKindsService, ParamValuesService],
})
export class ParamsModule {}

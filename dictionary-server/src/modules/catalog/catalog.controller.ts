import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ListQueryDto } from '~/common/list-query.dto';
import { createDictionaryController } from '~/common/dictionary.controller';
import {
  CreateHandToolDto,
  CreateMaterialDto,
  CreateMaterialTypeDto,
  CreatePowerToolDto,
  CreateVariantDto,
  MaterialQueryDto,
  UpdateHandToolDto,
  UpdateMaterialDto,
  UpdateMaterialTypeDto,
  UpdatePowerToolDto,
  createHandToolSchema,
  createMaterialSchema,
  createMaterialTypeSchema,
  createPowerToolSchema,
  updateHandToolSchema,
  updateMaterialSchema,
  updateMaterialTypeSchema,
  updatePowerToolSchema,
} from './catalog.dto';
import {
  HandToolsService,
  MaterialTypesService,
  MaterialsService,
  PowerToolsService,
} from './catalog.service';
import { VariantsService } from './variants.service';

@ApiTags('hand-tools')
@Controller('hand-tools')
export class HandToolsController extends createDictionaryController({
  summary: 'Ручной инструмент',
  createSchema: createHandToolSchema,
  updateSchema: updateHandToolSchema,
  createDto: CreateHandToolDto,
  updateDto: UpdateHandToolDto,
}) {
  constructor(
    protected readonly service: HandToolsService,
    private readonly variants: VariantsService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Ручной инструмент вместе с числом типоразмеров',
    description: 'variantsCount — сколько типоразмеров у позиции; 0 значит разворачивать нечего.',
  })
  override list(@Query() query: ListQueryDto) {
    return this.service.listWithVariantCount(query);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Типоразмеры инструмента с их параметрами' })
  listVariants(@Param('id', ParseIntPipe) id: number) {
    return this.variants.listByOwner('hand-tool', id);
  }

  @Post(':id/variants')
  @ApiOperation({ summary: 'Добавить типоразмер. code собирается автоматически' })
  createVariant(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateVariantDto) {
    return this.variants.create('hand-tool', id, dto);
  }
}

@ApiTags('power-tools')
@Controller('power-tools')
export class PowerToolsController extends createDictionaryController({
  summary: 'Электроинструмент',
  createSchema: createPowerToolSchema,
  updateSchema: updatePowerToolSchema,
  createDto: CreatePowerToolDto,
  updateDto: UpdatePowerToolDto,
}) {
  constructor(protected readonly service: PowerToolsService) {
    super();
  }
}

@ApiTags('material-types')
@Controller('material-types')
export class MaterialTypesController extends createDictionaryController({
  summary: 'Типы материалов: пиломатериалы, крепёж, сухие смеси, леса',
  createSchema: createMaterialTypeSchema,
  updateSchema: updateMaterialTypeSchema,
  createDto: CreateMaterialTypeDto,
  updateDto: UpdateMaterialTypeDto,
}) {
  constructor(protected readonly service: MaterialTypesService) {
    super();
  }
}

@ApiTags('materials')
@Controller('materials')
export class MaterialsController extends createDictionaryController({
  summary: 'Материалы',
  createSchema: createMaterialSchema,
  updateSchema: updateMaterialSchema,
  createDto: CreateMaterialDto,
  updateDto: UpdateMaterialDto,
}) {
  constructor(
    protected readonly service: MaterialsService,
    private readonly variants: VariantsService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Материалы вместе с единицей измерения, типом и числом типоразмеров',
    description:
      'Фильтры: ?typeId= — материалы одного типа, ?untyped=true — те, у кого тип ещё не проставлен. ' +
      'variantsCount — сколько типоразмеров у позиции; 0 значит разворачивать нечего.',
  })
  override list(@Query() query: MaterialQueryDto) {
    return this.service.listWithUnit(query);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Типоразмеры материала с их параметрами' })
  listVariants(@Param('id', ParseIntPipe) id: number) {
    return this.variants.listByOwner('material', id);
  }

  @Post(':id/variants')
  @ApiOperation({ summary: 'Добавить типоразмер. code собирается автоматически' })
  createVariant(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateVariantDto) {
    return this.variants.create('material', id, dto);
  }
}

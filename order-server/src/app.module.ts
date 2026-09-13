import { Module } from '@nestjs/common';
import { ZaiavkaController } from './zaiavka/zaiavka.controller';
import { ZaiavkaService } from './zaiavka/zaiavka.service';
import { PrismaService } from '../prisma/prisma.service';
import { ZaiavkaSheetGeneratorModule } from './zaiavka_sheet_generator/zaiavka_sheet_generator.module';

@Module({
  imports: [ZaiavkaSheetGeneratorModule],
  controllers: [ZaiavkaController],
  providers: [ZaiavkaService, PrismaService],
})
export class AppModule {}

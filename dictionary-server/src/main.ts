import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';

const PREFIX = 'dict/api/v1';
const PORT = Number(process.env.PORT ?? 4300);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(PREFIX);
  app.enableShutdownHooks();
  // Валидацию целиком делает Zod — ValidationPipe с class-validator тут не нужен.
  app.useGlobalPipes(new ZodValidationPipe());

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Справочник материалов и инструментов')
      .setDescription(
        'Позиции, их типоразмеры и параметры. Нормы расхода живут в calc-server — ' +
          'здесь их нет, и ссылки оттуда при удалении не проверяются.',
      )
      .setVersion('1.0.0')
      .addServer(`/${PREFIX}`)
      .build(),
  );

  app.use(`/${PREFIX}/openapi.json`, (_req: unknown, res: { json: (body: unknown) => void }) => {
    res.json(document);
  });

  app.use(
    `/${PREFIX}/docs`,
    apiReference({
      content: document,
      theme: 'purple',
    }),
  );

  await app.listen(PORT, '0.0.0.0');

  const logger = new Logger('bootstrap');
  logger.log(`Справочник поднят на :${PORT}`);
  logger.log(`Документация: /${PREFIX}/docs`);
}

void bootstrap();

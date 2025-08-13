require('dotenv').config(); // должен быть на вверхнем уровне чтобы не было ошибки

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ServiceEntrypointModule } from './service-entrypont/src/service-entrypoint.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceEntrypointModule);

  const config = new DocumentBuilder() // swagger
    .setTitle('Nest-api по пользователям')
    .setDescription('The users API description')
    .setVersion('0.0.1')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3300);
  console.log(`Сервер запущен УСПЕШНО`);
}
bootstrap();

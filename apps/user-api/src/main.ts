<<<<<<< HEAD
=======
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'docker') {
  dotenv.config({ path: 'docker/.env' });
} else {
  dotenv.config({ path: '.env.local' });
}

if (process.env.NODE_ENV === 'docker') {
  dotenv.config({ path: 'docker/.env' });
} else {
  dotenv.config({ path: '.env.local' });
}
>>>>>>> main
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ServiceEntrypointModule } from './service-entrypont/src/service-entrypoint.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceEntrypointModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest API по пользователям')
    .setDescription('The users API description')
    .setVersion('0.0.1')
    .addTag('users')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
  console.log(`Сервер запущен на порту ${process.env.PORT || 3000}`);
}

bootstrap();

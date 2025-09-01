/* eslint-disable @typescript-eslint/no-floating-promises */
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ServiceEntrypointModule } from './service-entrypont/src/service-entrypoint.module';
import { Transport } from '@nestjs/microservices';

if (process.env.NODE_ENV === 'docker') {
  dotenv.config({ path: 'docker/.env' });
} else {
  dotenv.config({ path: '.env.local' });
}

const enableRabbit = process.env.ENABLE_RABBITMQ === 'true';
const enableDb = process.env.ENABLE_DB === 'true';

async function bootstrap() {
  const app = await NestFactory.create(ServiceEntrypointModule);

  // Подключение RabbitMQ только если ENABLE_RABBITMQ=true
  if (enableRabbit) {
    if (!process.env.RABBITMQ_URI) {
      console.warn('RABBITMQ_URI не задан, подключение пропущено');
    } else {
      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'user_created',
          queueOptions: { durable: false },
        },
      });
      await app.startAllMicroservices();
      console.log('RabbitMQ микросервис подключен');
    }
  } else {
    console.log('RabbitMQ локально отключён');
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest-api по пользователям')
    .setDescription('The users API description')
    .setVersion('0.0.1')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Локально можно полностью пропустить подключение к БД
  if (!enableDb) {
    console.log('PostgreSQL локально отключён, подключение не выполняется');
  } else {
    // Здесь должен быть ваш код инициализации подключения к БД
    const pgUser = process.env.DB_USER;
    const pgPassword = process.env.DB_PASSWORD;
    const pgHost = process.env.DB_HOST;
    const pgPort = Number(process.env.DB_PORT) || 5432;

    if (!pgUser || !pgPassword) {
      throw new Error('PGUSER or PGPASSWORD not defined!');
    }

    console.log(
      `Подключение к PostgreSQL на ${pgHost}:${pgPort} с пользователем ${pgUser}`,
    );

    // Пример создания подключения через pg-pool
    // const pool = new Pool({ user: pgUser, host: pgHost, database: pgDatabase, password: pgPassword, port: pgPort });
    // await pool.connect();
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3300;
  await app.listen(port, '0.0.0.0');
  console.log(`Сервер запущен УСПЕШНО на порту ${port}`);
}

bootstrap();

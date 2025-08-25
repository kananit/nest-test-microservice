export const RABBITMQ_USER = process.env.RABBITMQ_USER!;
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD!;
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST!;
export const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT!, 10);

// Сборка URI прямо из переменных окружения Docker
export const RABBITMQ_URI =
  process.env.RABBITMQ_URI ||
  `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

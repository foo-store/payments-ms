import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  MqttStatus,
  RmqStatus,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('PaymentsMicroservice');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const rabbitmq = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [envs.rabbitMQUrl],
        queue: 'payments_queue',
        // noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
    { inheritAppConfig: true },
  );

  rabbitmq.status.subscribe((status: RmqStatus) => {
    logger.log(`Microservice using RABBITMQ is ${status}`);
  });

  app.enableCors();

  await app.startAllMicroservices();

  await app.listen(envs.paymentPort);

  logger.log(
    `Payments Hybrid is running on: ${envs.rabbitMQUrl} and port: ${envs.paymentPort}`,
  );
}
bootstrap();

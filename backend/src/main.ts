import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // CORS — apenas o frontend autorizado
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) throw new Error('FRONTEND_URL env var is required — refusing to start with wildcard CORS.');
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Validação global — strip de campos extra, transform automático
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // remove campos não declarados nos DTOs
    forbidNonWhitelisted: true,  // rejeita requests com campos extra
    transform: true,        // converte tipos automaticamente
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Passport BSides Porto API running on port ${port}`);
}

bootstrap();
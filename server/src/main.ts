import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Winston Logger (replace default logger)
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Security: Helmet middleware (security headers)
  app.use(helmet());

  // Security: Request size limits (prevent payload attacks)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Security: Global exception filter (consistent error responses)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('iMotion Back Office API')
    .setDescription('API documentation for iMotion Back Office internal management system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('therapist', 'Therapist management endpoints')
    .addTag('device', 'Device management endpoints')
    .addTag('session', 'Session tracking endpoints')
    .addTag('auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  const server = await app.listen(port);

  // Security: Request timeout (commented out for now - uncomment if needed)
  // server.setTimeout(30000); // 30 seconds

  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();

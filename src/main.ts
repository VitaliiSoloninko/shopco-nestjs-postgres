import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cookie parser middleware
  app.use(cookieParser());

  // Serve static files for uploaded images
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS - configured for credentials (cookies)
  app.enableCors({
    origin: ['http://localhost:4200', 'https://shopco-laden.web.app'], // Allowed frontend origins
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('ShopCo API')
    .setDescription('E-commerce API built with NestJS and PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Brands', 'Brand management endpoints')
    .addTag('Types', 'Type management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Cart', 'Shopping cart management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

void bootstrap();

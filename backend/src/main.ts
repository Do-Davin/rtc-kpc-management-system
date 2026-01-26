import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Enable CORS (Only once, allowing everything for Dev)
  app.enableCors();

  // 2. Setup Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Static Assets (Optional, depends on your project structure)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 4. THE FIX: Listen on '0.0.0.0' to allow Docker connections
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
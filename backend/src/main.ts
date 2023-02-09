import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();

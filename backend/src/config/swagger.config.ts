import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('42 Transendence')
  .setDescription('Trnscendnc API')
  .setVersion('0.1v')
  .addBearerAuth()
  .build();

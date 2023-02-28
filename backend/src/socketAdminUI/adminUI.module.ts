import { Module } from '@nestjs/common';
import { AdminUIGateWay } from './adminUI.gateway';

@Module({
  providers: [AdminUIGateWay],
})
export class AdminUIModule {}

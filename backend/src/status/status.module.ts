import { Module, Provider } from '@nestjs/common';
import { StatusService } from './status.service';
import { User } from './status.entity';

export const users = new Map<number, User>();

const StatusServiceProvider: Provider = {
  provide: 'StatusService',
  useFactory: () => new StatusService(),
  inject: [],
};
@Module({
  imports: [],
  providers: [StatusServiceProvider],
  exports: ['StatusService'],
})
export class StatusModule {}

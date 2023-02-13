import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { StatRepository } from './repository/stat.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import MatchHistory from 'src/entity/match.history.entity';
import { UserModule } from 'src/user/user.module';

const repo = {
  provide: 'IStatRepository',
  useClass: StatRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory]), UserModule],
  controllers: [StatController],
  providers: [StatService, repo],
})
export class StatModule {}

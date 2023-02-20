import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { BlockController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Relation from '../entity/relation.entity';
import { FriendsService } from './friends.service';
import { BlockService } from './block.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Relation]), UserModule],
  controllers: [FriendsController, BlockController],
  providers: [FriendsService, BlockService],
})
export class RelationModule {}

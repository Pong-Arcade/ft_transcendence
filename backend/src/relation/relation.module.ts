import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { BlockController } from './block.controller';

@Module({
  controllers: [FriendsController, BlockController],
})
export class RelationModule {}

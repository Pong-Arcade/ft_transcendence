import { Module, forwardRef } from '@nestjs/common';
import { StatusService } from './status.service';
import { User } from './status.entity';
import { ChatModule } from 'src/chat/chat.module';
import { GameModule } from 'src/game/game.module';
import { AuthModule } from 'src/auth/auth.module';
export const users = new Map<number, User>();
@Module({
  imports: [forwardRef(() => GameModule), ChatModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}

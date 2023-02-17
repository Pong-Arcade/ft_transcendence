import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.geteway';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chat.service';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [ChatGateway, ChatroomService],
  exports: [ChatGateway],
  controllers: [ChatroomController],
})
export class ChatModule {}

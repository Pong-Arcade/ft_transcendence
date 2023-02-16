import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { User } from '../status/status.entity';
import { users } from '../status/status.module';
import { Room } from '../chat/chatroom.entity';
import { Namespace } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

export const rooms = new Map<number, Room>();

type MessageType = 'message' | 'whisper' | 'systemMsg';
interface IMessage {
  content: string;
  type: MessageType;
}
enum EMessageType {
  MESSAGE = 'message',
  WHISPER = 'whisper',
  SYSTEMMSG = 'systemMsg',
}
@WebSocketGateway({
  namespace: 'socket/chat',
  cors: { origin: process.env.FE_HOST },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Namespace;
  async handleConnection(socket) {
    // 연결 끊김 핸들러
    socket.on('disconnect', () => {
      // 끊긴 소켓 삭제
      users.forEach((value, key, map) => {
        if (socket.id == value.socketid) {
          if (value.location > 0) {
            for (let i = 0; i < rooms.get(value.location).users.length; i++) {
              if (rooms.get(value.location).users[i] == value.userid) {
                rooms.get(value.location).users.splice(i);
                break;
              }
            }
          }
          users.delete(key);
        }
      });
    });
  }
  //연결 끊김
  async handleDisconnect(client) {
    console.log('disconnect');
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    users.set(info.userid, new User(info.userid, info.username, client.id));
  }

  @SubscribeMessage('message')
  async onMessage(client, msg) {
    const message: IMessage = {
      content: msg.msg,
      type: EMessageType.MESSAGE,
    };
    if (!msg.roomid) {
      this.server.to(rooms.get(0).title).emit('message', message);
    } else {
      this.server
        .to(rooms.get(msg.roomid).title)
        //.broadcast.emit('message', msg.msg);
        .emit('message', msg.msg);
    }
  }
  @SubscribeMessage('whisper')
  async onWhisper(client, msg) {
    for (const value of users.values()) {
      if (value.username == msg.toName) {
        const toWhisperMsg: IMessage = {
          content: `${msg.toName}에게: ${msg.msg}`,
          type: EMessageType.WHISPER,
        };
        const fromWhisperMsg: IMessage = {
          content: `${msg.fromName}로부터: ${msg.msg}`,
          type: EMessageType.WHISPER,
        };
        this.server.to(client.id).emit('whisper', toWhisperMsg);
        this.server.to(value.socketid).emit('whisper', fromWhisperMsg);
        console.log('send');
        return;
      }
    }

    const message: IMessage = {
      content: '접속중이지 않은 유저입니다.',
      type: EMessageType.SYSTEMMSG,
    };
    this.server.to(client.id).emit('systemMsg', message);
  }

  // @OnEvent('chatroom:join')
  // async onJoinRoom(client, roomid) {}
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Room } from './chat.entity';
import { User } from '../status/status.entity';
import { users } from '../status/status.module';

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
export let roomid = 0;
export let rooms = new Map<number, Room>();
@WebSocketGateway(4242, {
  transports: ['websocket'],
  // cors: { origin: 'http://localhost:8000' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  async handleConnection(socket) {
    // 연결 끊김 핸들러
    socket.on('disconnect', () => {
      // 끊긴 소켓 삭제
      users.forEach((value, key, map) => {
        if (socket.id == value.socketid) {
          if (value.location > 0) {
            for (let i = 0; i < rooms.get(value.location).Users.length; i++) {
              if (rooms.get(value.location).Users[i] == value.userid) {
                rooms.get(value.location).Users.splice(i);
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
  /**
   * 삭제예정
   */
  @SubscribeMessage('showRoom')
  async onshowRoom(client) {
    rooms.forEach((value, key, map) => {
      client.emit('showRoom', { value });
    });
  }

  /**
   * 삭제예정
   */
  @SubscribeMessage('createRoom')
  async onCreateRoom(client, info) {
    rooms.set(
      roomid,
      new Room(
        roomid,
        info.roomTitle,
        info.roomType,
        info.roomPassword,
        info.maxUser,
        info.creator,
      ),
    );
    client.emit('createdRoom', { code: 201, roomid: roomid });
    roomid++;
  }

  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    users.set(info.userid, new User(info.userid, info.username, client.id));
    client.join('dd');
    console.log('asdfsd: ', client.rooms);
  }

  @SubscribeMessage('message')
  async onMessage(client, msg) {
    const message: IMessage = {
      content: msg.msg,
      type: EMessageType.MESSAGE,
    };
    if (!msg.roomid) {
      this.server.to(rooms.get(0).roomname).emit('message', message);
    } else {
      this.server
        .to(rooms.get(msg.roomid).roomname)
        .broadcast.emit('message', message);
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
}

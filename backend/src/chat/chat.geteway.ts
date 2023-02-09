import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Room, User } from './chat.entity';

@WebSocketGateway(4242, {
  transports: ['websocket'],
  // cors: { origin: 'http://localhost:8000' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  roomid: number = 0;
  users = new Map<number, User>();
  rooms = new Map<number, Room>();
  async handleConnection(socket) {
    // 연결 끊김 핸들러
    socket.on('disconnect', () => {
      // 끊긴 소켓 삭제
      this.users.forEach((value, key, map) => {
        if (socket.id == value.socketid) {
          if (value.location > 0) {
            for (
              var i = 0;
              i < this.rooms.get(value.location).Users.length;
              i++
            ) {
              if (this.rooms.get(value.location).Users[i] == value.userid) {
                this.rooms.get(value.location).Users.splice(i);
                break;
              }
            }
          }
          this.users.delete(key);
        }
      });
    });
  }
  //연결 끊김
  async handleDisconnect() {
    console.log('disconnect');
  }

  @SubscribeMessage('showRoom')
  async onshowRoom(client) {
    console.log(this.rooms);
    this.rooms.forEach((value, key, map) => {
      client.emit('showRoom', { value });
    });
  }

  /**
   * 삭제예정
   */
  @SubscribeMessage('createRoom')
  async onCreateRoom(client, info) {
    this.rooms.set(
      this.roomid,
      new Room(
        this.roomid,
        info.roomTitle,
        info.roomType,
        info.roomPassword,
        info.maxUser,
        info.creator,
      ),
    );
    client.emit('createdRoom', { code: 201, roomid: this.roomid });
    this.roomid++;
  }

  /**
   * 삭제예정
   */
  @SubscribeMessage('joinLobby')
  async onJoinLobby(client, userid) {
    if (this.rooms.size == 0) {
      this.rooms.set(0, new Room(0, 'lobby', 0, '', 100, 0));
    }
    client.join('lobby');
    this.users.get(userid).location = 0;
  }

  /**
   * 삭제예정
   */
  @SubscribeMessage('addUser')
  async onAddUser(client, info) {
    // client.userid = info.userid;
    this.users.set(
      info.userid,
      new User(info.userid, info.username, client.id, -1),
    );
  }

  @SubscribeMessage('chat')
  async onChat(client, message) {
    client.broadcast.emit('chat', message);
  }

  @SubscribeMessage('message')
  async onMessage(client, msg) {
    if (!msg.roomid) {
      this.server.to(this.rooms.get(0).roomname).emit('message', msg.msg);
    } else {
      this.server
        .to(this.rooms.get(msg.roomid).roomname)
        .broadcast.emit('message', msg.msg);
    }
  }
  @SubscribeMessage('whisper')
  async onWhisper(client, msg) {
    console.log(msg);
    this.users.forEach((value, key, map) => {
      if (value.username == msg.toName) {
        this.server
          .to(client.id)
          .emit('whisper', msg.toName + '에게: ' + msg.msg);
        this.server
          .to(value.socketid)
          .emit('whisper', msg.fromName + '로 부터: ' + msg.msg);
        console.log('send');
        return;
      }
    });
    this.server.to(client.id).emit('system', '접속중이지 않은 유저입니다.');
  }
}

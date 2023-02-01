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
  async handleDisconnect() {}

  @SubscribeMessage('showRoom')
  async onshowRoom(client) {
    console.log(this.rooms);
    this.rooms.forEach((value, key, map) => {
      client.emit('showRoom', { value });
    });
  }

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

  @SubscribeMessage('joinLobby')
  async onJoinLobby(client, userid) {
    if (this.rooms.size == 0) {
      this.rooms.set(0, new Room(0, 'lobby', 0, '', 100, 0));
    }
    client.join('lobby');
    this.users.get(userid).location = 0;
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client, info) {
    const room = this.rooms.get(info.roomid);
    if (room === undefined) {
      // error code 존재하지 않는 방
    }
    if (room.type === 1) {
      if (room.password == info.password) {
        client.emit('joinRoom', info.roomid);
        room.Users.push(info.userid);
      } else {
        // error code 비밀번호 틀림
      }
    } else if (room.type === 2) {
      // private 방
    }
  }

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
        .emit('message', msg.msg);
    }
  }
  @SubscribeMessage('whisper')
  async onWhisper(client, msg) {
    this.users.forEach((value, key, map) => {
      if (value.username == msg.username) {
        this.server.to(value.socketid).emit('message', msg.msg);
      }
    });
  }
}

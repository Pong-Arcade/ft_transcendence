import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

@WebSocketGateway({
  cors: {
    origin: ['https://admin.socket.io'],
    Credentials: true,
  },
})
export class AdminUIGateWay {
  @WebSocketServer()
  server: Server;

  afterInit() {
    instrument(this.server, {
      auth: false,
    });
  }
}

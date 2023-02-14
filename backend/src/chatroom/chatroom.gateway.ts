import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Room } from './chatroom.entity';
export let rooms = new Map<number, Room>();

@WebSocketGateway()
export class ChatroomGateway {}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

/**
 * 게임방 초대 요청 dto입니다.
 * users: 초대할 유저들의 ID
 */
export class GameRoomInviteRequestDto {
  @ApiProperty({
    description: '초대할 유저들의 ID',
    example: [1, 2, 3],
  })
  @IsArray({
    message: 'users는 배열이어야 합니다.',
    each: true,
  })
  @IsNumber(
    {},
    {
      message: 'users의 요소는 숫자여야 합니다.',
      each: true,
    },
  )
  users: number[];
}

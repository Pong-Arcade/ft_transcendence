import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GameRoomMode } from 'src/enum/gameroom.mode.enum';
import { MatchType } from 'src/enum/match.type.enum';

/**
 * 게임방 생성 요청 dto입니다.
 * mode: 게임방 모드
 * type: 대전 유형
 * title: 게임방 제목
 * password: 게임방 비밀번호
 * maxSpectatorCount: 최대 관전자 수
 */
export class GameRoomCreateRequestDto {
  @ApiProperty({
    description: '게임방 모드 (파워업/일반)',
    example: GameRoomMode.POWER_UP,
    enum: GameRoomMode,
  })
  @IsEnum(GameRoomMode)
  mode: GameRoomMode;

  @ApiProperty({
    description: '대전 유형',
    example: MatchType.LADDER,
    enum: MatchType,
  })
  @IsEnum(MatchType)
  type: MatchType;

  @ApiProperty({
    description: '승리 점수',
    example: 10,
  })
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(10)
  winScore: number;

  @ApiProperty({
    description: '게임방 제목',
    example: '게임방 제목입니다.',
  })
  @IsString()
  @MaxLength(32)
  title: string;

  @ApiProperty({
    description: '최대 관전자 수',
    example: 10,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(5)
  maxSpectatorCount: number;
}

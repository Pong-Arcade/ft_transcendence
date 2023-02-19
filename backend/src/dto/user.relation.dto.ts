import { ApiProperty } from '@nestjs/swagger';

export class UserRelationDto {
  @ApiProperty({
    description: '사용자의 UserId',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '타겟의 userId',
    example: 2,
  })
  targetUserId: number;
}

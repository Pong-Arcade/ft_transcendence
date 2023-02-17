import { ApiProperty } from '@nestjs/swagger';

export class UserRelationDto {
  @ApiProperty({
    description: '사용자의 UserId',
    example: 1,
  })
  user: number;

  @ApiProperty({
    description: '타겟의 userId',
    example: 2,
  })
  target: number;
}

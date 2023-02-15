import { ApiProperty } from '@nestjs/swagger';
import { UserStatusDto } from '../user.status.dto';
import { UserStatus } from 'src/enum/user.status.enum';

export class UserInfoResponseDto {
  @ApiProperty({
    description: '상태를 포함하는 유저 정보',
    example: {
      userId: 1,
      nickname: 'user',
      avatarUrl: 'http://example.com',
      status: UserStatus.ONLINE,
    } as UserStatusDto,
  })
  userInfo: UserStatusDto;
}

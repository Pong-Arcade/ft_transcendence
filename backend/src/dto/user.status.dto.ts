import { UserStatus } from 'src/enum/user.status.enum';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 상태를 포함한 유저의 정보를 반환하는 dto입니다.
 */
export class UserStatusDto extends UserDto {
  @ApiProperty({
    description: '유저의 상태(온라인/오프라인)',
    example: UserStatus.ONLINE,
    enum: UserStatus,
  })
  status: UserStatus;
}

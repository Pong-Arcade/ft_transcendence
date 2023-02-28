import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserAuthDto extends UserDto {
  @ApiProperty({ description: '유저의 2FA 인증 여부' })
  is2FA: boolean;

  @ApiProperty({ description: '유저의 2FA 인증 키' })
  access?: string;
}

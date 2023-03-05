import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserInfoRequestDto {
  @ApiProperty({
    description: '변경할 닉네임(optional)',
    required: false,
    example: 'new nickname',
  })
  @Optional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  nickname?: string;

  @ApiProperty({
    description: '변경할 아바타 이미지(optional)',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @Optional()
  @IsNotEmpty()
  avatarImage?: any;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

//	import * as Session from '';

import { UserRepository } from './user.repository';
import { UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		//	Todo : Session 가져다 쓰기
	) {};

	//	Pipe로 변경?
	createDto(user: User): UserDto {
		return {
			userId: user.userId,
			intraId: user.intraId,
			imgUrl: user.avatarUrl,
		};
	};

	/*
	createEntity(userDto: UserDto): User {
		const user: User {
			userId = userDto.userId;
			nickName = userDto.intraId;
			intraId = userDto.intraId;
			avatarUrl = userDto.imgUrl;
		};
		return user;
	}
	*/

	async getUserById(id: number): Promise<UserDto> {
		const ret: User = await this.userRepository.getUserById(id);
		return this.createDto(ret);
	}
}

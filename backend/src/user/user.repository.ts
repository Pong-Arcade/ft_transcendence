import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository, DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

//	Repository는 UserDTO 알 수 없게,
//	Service Layer에서 User Entity로 변경되어 넘어오게 설계

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(user: User): Promise<User> {

		const ret = this.create(user);
		try {
			await this.save(ret);
		} catch (e) {
			console.log(e);
		}
		return ret;
	}

	async getUserById(id: number): Promise<User> {
		const user = await this.findOne({
			where: {
				userId: id,
			},
		});

		if (!user) throw new NotFoundException(`User(${id}) Not Exist`);
		return user;
	}
}

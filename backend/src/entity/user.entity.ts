import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import Relation from './relation.entity';
import { TwoFactorAuth } from './two.factor.auth.entity';

@Entity('user')
export default class User {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 36,
    unique: true,
  })
  nickname: string;

  @Column({
    name: 'avatar_url',
    type: 'text',
  })
  avatarUrl: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'first_login',
    type: 'timestamp',
    nullable: true,
  })
  firstLogin: Date;

  @OneToMany(() => Relation, (relation) => relation.user)
  relations: Relation[];

  @OneToOne(() => TwoFactorAuth, (twoFactorAuth) => twoFactorAuth.user)
  twoFactorAuth: TwoFactorAuth;
}

import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Relation from './relation.entity';

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
    length: 32,
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

  // TODO: Relation과의 관계를 정의해야 함
}

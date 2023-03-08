import { UserRelationType } from 'src/enum/user.relation.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('relation')
export default class Relation {
  @PrimaryGeneratedColumn({
    name: 'relation_id',
    type: 'int',
  })
  relationId: number;

  @ManyToOne(() => User, (user) => user.relations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.relations)
  @JoinColumn({ name: 'target_user_id' })
  targetUser: User;

  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: UserRelationType,
  })
  relationType: UserRelationType;
}

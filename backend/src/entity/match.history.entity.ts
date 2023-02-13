import { MatchType } from 'src/enum/match.type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('match_history')
export default class MatchHistory {
  @PrimaryGeneratedColumn({
    name: 'match_id',
    type: 'int',
  })
  matchId: number;

  @Column({
    name: 'red_user_id',
    type: 'int',
  })
  redUserId: number;

  @Column({
    name: 'blue_user_id',
    type: 'int',
  })
  blueUserId: number;

  @Column({
    name: 'red_score',
    type: 'int',
  })
  redScore: number;

  @Column({
    name: 'blue_score',
    type: 'int',
  })
  blueScore: number;

  @Column({
    name: 'begin_date',
    type: 'timestamp',
  })
  beginDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp',
  })
  endDate: Date;

  @Column({
    name: 'match_type',
    type: 'enum',
    enum: MatchType,
  })
  matchType: MatchType;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'red_user_id' })
  redUser: User;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'blue_user_id' })
  blueUser: User;
}

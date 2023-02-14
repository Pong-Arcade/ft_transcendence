import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from './user.entity';

@Entity('ladder_stat')
export default class LadderStat {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @Column({
    name: 'win_count',
    type: 'int',
  })
  winCount: number;

  @Column({
    name: 'lose_count',
    type: 'int',
  })
  loseCount: number;

  @Column({
    name: 'ladder_score',
    type: 'int',
  })
  ladderScore: number;

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

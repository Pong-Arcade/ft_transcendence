import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from './user.entity';

@Entity('normal_stat')
export default class NormalStat {
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

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

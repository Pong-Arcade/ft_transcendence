import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from './user.entity';

@Entity('two_factor_auth')
export class TwoFactorAuth {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @Column({
    name: '2FA',
    type: 'boolean',
  })
  is2FA: boolean;

  @Column({
    name: 'access',
    type: 'varchar',
    length: 256,
  })
  access: string;

  @OneToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

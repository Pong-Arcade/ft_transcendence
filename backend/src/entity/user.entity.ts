import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  userId: number;
  
  @Column({
    type: "varchar",
	length: 20,
	unique: true,
  })
  nickName: string;
  
  @Column()
  intraId: string;

  @Column()
  avatarUrl: string;
}

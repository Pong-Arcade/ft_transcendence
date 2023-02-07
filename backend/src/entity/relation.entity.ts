import { UserRelationType } from 'src/enum/user.relation.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('relation')
export default class Relation {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @PrimaryColumn({
    name: 'other_user_id',
    type: 'int',
  })
  otherUserId: number;

  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: UserRelationType,
  })
  relationType: UserRelationType;
}

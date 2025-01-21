// src/entities/member.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ColocationEntity } from "./colocation.entity";
import { UserEntity } from "./user.entity";

@Entity("members")
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ColocationEntity, colocation => colocation.members)
  colocation: ColocationEntity;

  @ManyToOne(() => UserEntity, user => user.memberships)
  user: UserEntity;
}

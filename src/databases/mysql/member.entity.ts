// src/entities/member.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ColocationEntity } from "./colocation.entity";  // Pour relier la colocation
import { UserEntity } from "./user.entity";  // Pour relier l'utilisateur à la colocation

@Entity("members")
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ColocationEntity, colocation => colocation.members)
  colocation: ColocationEntity; // La colocation à laquelle appartient le membre

  @ManyToOne(() => UserEntity, user => user.memberships)
  user: UserEntity; // L'utilisateur membre de la colocation
}

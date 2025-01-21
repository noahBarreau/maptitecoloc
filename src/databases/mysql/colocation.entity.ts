// src/entities/colocation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { MemberEntity } from "./member.entity";

@Entity("colocations")
export class ColocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column('float')
  area: number;

  @Column()
  numberOfRooms: number;

  @Column()
  ownerOrAgency: string;

  @ManyToOne(() => UserEntity, user => user.colocations)
  owner: UserEntity;

  @OneToMany(() => MemberEntity, member => member.colocation)
  members: MemberEntity[];
}

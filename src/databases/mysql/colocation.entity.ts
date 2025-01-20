// src/entities/colocation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";  // Pour lier avec l'utilisateur (propriétaire)
import { MemberEntity } from "./member.entity"; // Lien avec les membres de la colocation

@Entity("colocations")
export class ColocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string; // Lieu de la colocation

  @Column('float')
  area: number; // Surface en m²

  @Column()
  numberOfRooms: number; // Nombre de chambres

  @Column()
  ownerOrAgency: string; // Propriétaire ou agence (pouvant être un nom ou une agence)

  @ManyToOne(() => UserEntity, user => user.colocations)
  owner: UserEntity; // L'utilisateur propriétaire de la colocation

  @OneToMany(() => MemberEntity, member => member.colocation)
  members: MemberEntity[]; // Membres de la colocation
}

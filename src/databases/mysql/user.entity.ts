import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ColocationEntity } from "./colocation.entity";
import { MemberEntity } from "./member.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  age: number;

  @OneToMany(() => ColocationEntity, colocation => colocation.owner)
  colocations: ColocationEntity[];

  @OneToMany(() => MemberEntity, member => member.user)
  memberships: MemberEntity[];
}

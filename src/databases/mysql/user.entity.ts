import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ColocationEntity } from "./colocation.entity";
import { MemberEntity } from "./member.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 , nullable: false })
  firstname: string;

  @Column({ length: 50 , nullable: false })
  lastname: string;

  @Column({ unique: true , nullable: false })
  email: string;

  @Column({nullable: false })
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

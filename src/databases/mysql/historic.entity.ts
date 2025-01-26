// src/entities/colocation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn  } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("historic")
export class HistoricEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  method: string;

  @Column({ nullable: false })
  url: string;

  @Column()
  action: string;

  @Column()
  user: string;

  @Column()
  comment: string;

  @Column()
  successful: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

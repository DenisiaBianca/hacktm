import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { CounterTypeEnum } from "../helpers";

@Entity()
export class CounterRead extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: CounterTypeEnum,
    nullable: false,
  })
  type: CounterTypeEnum;

  @Column()
  userId: number;

  @Column()
  @CreateDateColumn()
  date: Date;

  @Column()
  value: number;
}

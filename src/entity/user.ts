import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { validate } from "class-validator";
import { RoleEnum } from "../helpers";

@Entity()
@Unique(["username"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  username: string;

  @Column()
  @IsNotEmpty()
  encryptedPassword: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    nullable: false,
  })
  role: RoleEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  personalDataId: number;

  hashPassword() {
    this.encryptedPassword = bcrypt.hashSync(this.encryptedPassword, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.encryptedPassword);
  }
}

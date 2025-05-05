/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({
    nullable: true,
    comment: "user's profile picture as a base64 string",
  })
  profilePicture: string;

  @Column({
    default: false,
    comment: "to check if the used verified his phone number",
  })
  isVerified: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({
    nullable: true,
    comment: "used for password reset/verification code",
  })
  verficationCode: string;

  @Column({ default: new Date() })
  createdAt: Date;
}

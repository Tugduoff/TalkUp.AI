/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity({ schema: "users" })
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: false })
  username: string;

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

  @Column({
    nullable: true,
    comment: "used for password reset/verification code",
  })
  verficationCode: string;

  @Column({ default: new Date() })
  createdAt: Date;
}

/**
 * The UserEmail entity represents the relationship between a user and their email address.
 * It contains a foreign key to the User entity and a foreign key to the Email entity.
 * This allows for a one-to-one relationship between a user and their email address.
 */
@Entity({ schema: "users" })
export class UserEmail {
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId: number;

  @OneToOne(() => Email)
  @JoinColumn({ name: "emailId" })
  emailId: number;
}

/**
 * The Email entity represents an email address.
 * It contains a unique email address and a primary key.
 * This allows for a one-to-one relationship between a user and their email address.
 */
@Entity({ schema: "users" })
export class Email {
  @PrimaryGeneratedColumn()
  emailId: number;

  @Column({ unique: true, nullable: false })
  email: string;
}

/**
 * The UserPassword entity represents the relationship between a user and their password.
 * It contains a foreign key to the User entity and a foreign key to the Password entity.
 * This allows for a one-to-one relationship between a user and their password.
 */
@Entity({ schema: "users" })
export class UserPassword {
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId: number;

  @OneToOne(() => Password)
  @JoinColumn({ name: "passwordId" })
  passwordId: number;
}

/**
 * The Password entity represents a password.
 * It contains a password and a primary key.
 * This allows for a one-to-one relationship between a user and their password.
 */
@Entity({ schema: "users" })
export class Password {
  @PrimaryGeneratedColumn()
  passwordId: number;

  @Column({ nullable: false })
  password: string;
}

/**
 * The UserPhoneNumber entity represents the relationship between a user and their phone number.
 * It contains a foreign key to the User entity and a foreign key to the PhoneNumber entity.
 * This allows for a one-to-one relationship between a user and their phone number.
 */
@Entity({ schema: "users" })
export class UserPhoneNumber {
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId: number;

  @OneToOne(() => PhoneNumber)
  @JoinColumn({ name: "phoneNumberId" })
  phoneNumberId: number;
}

/**
 * The PhoneNumber entity represents a phone number.
 * It contains a phone number and a primary key.
 * This allows for a one-to-one relationship between a user and their phone number.
 */
@Entity({ schema: "users" })
export class PhoneNumber {
  @PrimaryGeneratedColumn()
  phoneNumberId: number;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;
}

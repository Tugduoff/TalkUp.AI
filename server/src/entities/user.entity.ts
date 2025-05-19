import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class user {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({ nullable: false })
  user_name: string;

  @Column({
    nullable: true,
    comment: "user's profile picture as a base64 string",
  })
  profile_picture: string;

  @Column({
    default: false,
    comment: "to check if the used verified his phone number",
  })
  is_verified: boolean;

  @Column({
    nullable: true,
    comment: "used for password reset/verification code",
  })
  verfication_code: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  last_accessed_at: Date;

  @Column({ default: new Date() })
  updated_at: Date;
}

/**
 * The user_email entity represents the relationship between a user and their email address.
 * It contains a foreign key to the User entity.
 * This allows for a one-to-one relationship between a user and their email address.
 */
@Entity()
export class user_email {
  @PrimaryGeneratedColumn()
  email_id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @OneToOne(() => user)
  @JoinColumn({ name: "user_id" })
  user_id: string;
}

/**
 * The user_password entity represents the relationship between a user and their password.
 * It contains a foreign key to the User entity.
 * This allows for a one-to-one relationship between a user and their password.
 */
@Entity()
export class user_password {
  @PrimaryGeneratedColumn()
  password_id: number;

  @OneToOne(() => user)
  @JoinColumn({ name: "user_id" })
  user_id: string;

  @Column({ nullable: false })
  password: string;
}

/**
 * The user_phonenumber entity represents the relationship between a user and their phone number.
 * It contains a foreign key to the User entity.
 * This allows for a one-to-one relationship between a user and their phone number.
 */
@Entity()
export class user_phonenumber {
  @PrimaryGeneratedColumn()
  phonenumber_id: number;

  @OneToOne(() => user)
  @JoinColumn({ name: "user_id" })
  user_id: string;

  @Column({ unique: true, nullable: false })
  phone_number: string;
}

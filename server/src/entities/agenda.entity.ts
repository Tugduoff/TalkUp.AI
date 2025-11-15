import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import { uuidv7 } from "uuidv7";

import { user } from "./user.entity";

@Entity()
export class agenda_event {
  @PrimaryGeneratedColumn("uuid")
  event_id: string;

  @ManyToOne(() => user, (user) => user.user_id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: "text" })
  description: string;

  @Column({ type: "timestamptz", nullable: false })
  start_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  end_at: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  all_day: boolean;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  timezone: string;

  @CreateDateColumn ({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP"
  })
  updated_at: Date;


  /*----- UUID manual generation to ensure V7 format ------ */


  @BeforeInsert()
  generateUUIDv7() {
    if (!this.event_id) this.event_id = uuidv7();
  }
}

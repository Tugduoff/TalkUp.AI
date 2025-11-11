import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  BeforeInsert,
  ManyToOne,
} from "typeorm";
import { uuidv7 } from "uuidv7";

import { AiTranscriptStated } from "@common/enums/AiTranscriptStated";

import { ai_interview } from "./aiInterview.entity";

@Entity()
export class ai_transcript {
  @PrimaryGeneratedColumn("uuid")
  transcript_id: string;

  @ManyToOne(() => ai_interview, (interview) => interview.interview_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "interview_id" })
  interview_id: string;

  @Column({ type: "text" })
  content: string;

  @Column({
    type: "enum",
    enum: AiTranscriptStated,
  })
  who_stated: AiTranscriptStated;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  inserted_at: string;

  // ------ UUID manual generation to ensure V7 format ------ //

  @BeforeInsert()
  generateUUIDv7() {
    if (!this.transcript_id) this.transcript_id = uuidv7();
  }
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { user } from "./user.entity";

@Entity()
export class organization {
  @PrimaryGeneratedColumn("uuid")
  org_id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  domain: string;

  @Column({ nullable: true })
  sso_provider: string;

  @Column({ type: "jsonb", nullable: true })
  sso_config: Record<string, unknown>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => user, (user) => user.organizations)
  users: user[];
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { user } from "./user.entity";
import { organization } from "./organization.entity";

@Entity("user_organization")
export class UserOrganization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  org_id: string;

  @Column({ default: "user" })
  role: string;

  @ManyToOne(() => user)
  @JoinColumn({ name: "user_id" })
  user: user;

  @ManyToOne(() => organization)
  @JoinColumn({ name: "org_id" })
  organization: organization;
}

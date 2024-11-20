import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 150 })
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    betAmount: number;

    @Column("timestamp")
    startDate: Date;

    @Column("timestamp")
    endDate: Date;

    @Column({ default: "pending" }) // Status: pending, approved, rejected, deleted
    status: string;

    @ManyToOne(() => User, (user) => user.id)
    creator: User;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";

@Entity()
export class Bet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Event, (event) => event.id)
    event: Event;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column()
    prediction: boolean; // True = "Sim", False = "Não"
}

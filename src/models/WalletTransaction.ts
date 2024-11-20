import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";

@Entity()
export class WalletTransaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column()
    type: string; // "deposit" ou "withdraw"

    @Column({ nullable: true })
    details: string; // Detalhes para saque (ex.: dados bancários)

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;
}

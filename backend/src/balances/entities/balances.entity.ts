import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('balances')
export class Balances {
    @PrimaryGeneratedColumn()
    id_balance: number;

    @Column()
    id_categoria: number;

    @Column()
    dni: number;

    @Column()
    monto_propietario: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
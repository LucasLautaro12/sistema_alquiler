import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Balances } from "../../balances/entities/balances.entity";

@Entity('categorias')
export class Categorias {
    @PrimaryGeneratedColumn()
    id_categoria: number;

    @Column({ length: 255 })
    nombre: string;

    @Column({})
    monto_total: number;

    @Column({})
    monto_persona: number;

    @Column({})
    pagado_por_dni: number;

    @Column({})
    esta_pagado: boolean;

    @OneToMany(() => Balances, (balances) => balances.id_categoria)
    balances: Balances[]; 

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

}
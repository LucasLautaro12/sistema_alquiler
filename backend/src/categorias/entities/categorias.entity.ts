// src/categorias/entities/categorias.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Balances } from "../../balances/entities/balances.entity";
import { Usuarios } from "src/usuarios/entities/usuario.entity";

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
    esta_pagado: boolean;

    @ManyToOne(() => Usuarios, (usuarios) => usuarios.pagado_por_dni)
    @JoinColumn({ name: 'pagado_por_dni' })
    pagado_por_dni: Usuarios;

    @OneToMany(() => Balances, (balances) => balances.id_categoria)
    balances: Balances[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
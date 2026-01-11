// src/balances/entities/balances.entity.ts
import { Categorias } from "src/categorias/entities/categorias.entity";
import { Usuarios } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('balances')
export class Balances {
    @PrimaryGeneratedColumn()
    id_balance: number;

    @ManyToOne(() => Categorias, categorias => categorias.balances)
    @JoinColumn({ name: 'id_categoria' })
    id_categoria: number;

    @ManyToOne(() => Usuarios, usuarios => usuarios.balances)
    @JoinColumn({ name: 'dni' })
    dni: number;

    @Column('decimal', { precision: 10, scale: 2 })
    monto_propietario: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
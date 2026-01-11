// src/usuarios/entities/usuario.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Balances } from '../../balances/entities/balances.entity';
import { Categorias } from '../../categorias/entities/categorias.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  dni: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 500 })
  contrasenia: string;

  @OneToMany(() => Balances, (balances) => balances.dni)
  balances: Balances[];  

  @OneToMany(() => Categorias, (categorias) => categorias.pagado_por_dni)
  pagado_por_dni: Categorias[]; 

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
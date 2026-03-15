// src/usuarios/entities/usuario.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn()
  dni: number;

  @Column({ length: 100 })
  nombre: string;

  @Exclude()
  @Column({ length: 500 })
  contrasenia: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
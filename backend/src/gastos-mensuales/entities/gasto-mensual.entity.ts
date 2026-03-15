// src/gastos-mensuales/entities/gasto-mensual.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Usuarios } from '../../usuarios/entities/usuario.entity';

@Entity('gastos_mensuales')
@Unique(['mes', 'anio'])
export class GastoMensual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  anio: number;

  @Column('decimal', { precision: 10, scale: 2 })
  alquiler: number;

  @Column('decimal', { precision: 10, scale: 2 })
  gas: number;

  @Column('decimal', { precision: 10, scale: 2 })
  luz_agua: number;

  @Column('decimal', { precision: 10, scale: 2 })
  expensas: number;

  // Usuario que pagó el gas (optional)
  @ManyToOne(() => Usuarios, { nullable: true, eager: true })
  @JoinColumn({ name: 'pagador_gas_dni' })
  pagador_gas: Usuarios | null;

  // Usuario que pagó luz/agua (optional)
  @ManyToOne(() => Usuarios, { nullable: true, eager: true })
  @JoinColumn({ name: 'pagador_luz_agua_dni' })
  pagador_luz_agua: Usuarios | null;

  // Usuario que pagó expensas (optional)
  @ManyToOne(() => Usuarios, { nullable: true, eager: true })
  @JoinColumn({ name: 'pagador_expensas_dni' })
  pagador_expensas: Usuarios | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

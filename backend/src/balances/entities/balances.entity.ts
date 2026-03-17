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
import { GastoMensual } from '../../gastos-mensuales/entities/gasto-mensual.entity';

/**
 * Balance histórico / snapshot por usuario y mes.
 * Se genera (o regenera) al pedir el resumen mensual.
 * Permite consultar deudas sin recalcular cada vez.
 */
@Entity('balances')
@Unique(['usuario', 'gastoMensual'])
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuarios, { eager: true, nullable: false })
  @JoinColumn({ name: 'usuario_dni' })
  usuario: Usuarios;

  @ManyToOne(() => GastoMensual, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gasto_mensual_id' })
  gastoMensual: GastoMensual;

  @Column('decimal', { precision: 10, scale: 2, comment: 'Monto base = total / cant. usuarios' })
  montoBase: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, comment: 'Total pagado por el usuario en servicios' })
  totalPagado: number;

  @Column('decimal', { precision: 10, scale: 2, comment: 'Deuda final = montoBase - totalPagado' })
  deudaFinal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
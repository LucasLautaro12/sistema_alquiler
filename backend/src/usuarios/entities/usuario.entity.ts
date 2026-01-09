import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
/* import { Balance } from '../../balances/entities/balance.entity';
import { Category } from '../../categories/entities/category.entity'; */

@Entity('users')
export class Usuario {
  @PrimaryGeneratedColumn()
  dni: number;

  @Column({ length: 100 })
  nombre: string;

  /* @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];

  @OneToMany(() => Category, (category) => category.paidByUser)
  paidCategories: Category[]; */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
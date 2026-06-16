import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/base.entity';
import { ExpensePayment } from '../../expense-payments/entities/expense-payment.entity';
import { CashContribution } from '../../cash-contributions/entities/cash-contribution.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'int' })
  dni: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string;

  @OneToMany(() => ExpensePayment, (payment) => payment.user)
  expensePayments: ExpensePayment[];

  @OneToMany(() => CashContribution, (contribution) => contribution.user)
  cashContributions: CashContribution[];
}

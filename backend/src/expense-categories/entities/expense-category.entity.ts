import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MonthlyExpense } from '../../monthly-expenses/entities/monthly-expense.entity';
import { ExpensePayment } from '../../expense-payments/entities/expense-payment.entity';

@Entity('expense_categories')
export class ExpenseCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_cash_payment' })
  isCashPayment: boolean;

  @OneToMany(() => MonthlyExpense, (expense) => expense.expenseCategory)
  monthlyExpenses: MonthlyExpense[];

  @OneToMany(() => ExpensePayment, (payment) => payment.expenseCategory)
  expensePayments: ExpensePayment[];
}

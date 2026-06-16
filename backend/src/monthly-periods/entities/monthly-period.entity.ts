import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MonthlyExpense } from '../../monthly-expenses/entities/monthly-expense.entity';
import { ExpensePayment } from '../../expense-payments/entities/expense-payment.entity';
import { CashContribution } from '../../cash-contributions/entities/cash-contribution.entity';

@Entity('monthly_periods')
@Unique(['year', 'month'])
export class MonthlyPeriod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  year: number;

  @Index()
  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'boolean', default: false, name: 'is_closed' })
  isClosed: boolean;

  @OneToMany(() => MonthlyExpense, (expense) => expense.monthlyPeriod)
  monthlyExpenses: MonthlyExpense[];

  @OneToMany(() => ExpensePayment, (payment) => payment.monthlyPeriod)
  expensePayments: ExpensePayment[];

  @OneToMany(() => CashContribution, (contribution) => contribution.monthlyPeriod)
  cashContributions: CashContribution[];
}

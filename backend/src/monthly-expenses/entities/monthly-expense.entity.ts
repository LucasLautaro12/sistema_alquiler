import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MonthlyPeriod } from '../../monthly-periods/entities/monthly-period.entity';
import { ExpenseCategory } from '../../expense-categories/entities/expense-category.entity';

@Entity('monthly_expenses')
@Unique(['monthlyPeriod', 'expenseCategory'])
export class MonthlyExpense extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonthlyPeriod, (period) => period.monthlyExpenses, { nullable: false })
  @JoinColumn({ name: 'monthly_period_id' })
  @Index()
  monthlyPeriod: MonthlyPeriod;

  @ManyToOne(() => ExpenseCategory, (category) => category.monthlyExpenses, { nullable: false })
  @JoinColumn({ name: 'expense_category_id' })
  @Index()
  expenseCategory: ExpenseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;
}

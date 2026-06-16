import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MonthlyPeriod } from '../../monthly-periods/entities/monthly-period.entity';
import { ExpenseCategory } from '../../expense-categories/entities/expense-category.entity';
import { User } from '../../users/entities/user.entity';

@Entity('expense_payments')
export class ExpensePayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonthlyPeriod, (period) => period.expensePayments, { nullable: false })
  @JoinColumn({ name: 'monthly_period_id' })
  @Index()
  monthlyPeriod: MonthlyPeriod;

  @ManyToOne(() => ExpenseCategory, (category) => category.expensePayments, { nullable: false })
  @JoinColumn({ name: 'expense_category_id' })
  @Index()
  expenseCategory: ExpenseCategory;

  @ManyToOne(() => User, (user) => user.expensePayments, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date', name: 'payment_date', default: () => 'CURRENT_DATE' })
  @Index()
  paymentDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}

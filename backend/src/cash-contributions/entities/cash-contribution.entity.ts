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
import { User } from '../../users/entities/user.entity';

@Entity('cash_contributions')
export class CashContribution extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonthlyPeriod, (period) => period.cashContributions, { nullable: false })
  @JoinColumn({ name: 'monthly_period_id' })
  @Index()
  monthlyPeriod: MonthlyPeriod;

  @ManyToOne(() => User, (user) => user.cashContributions, { nullable: false })
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

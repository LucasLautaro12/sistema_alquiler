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

  @Column({ type: 'int', name: 'total_points', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', name: 'exact_predictions', default: 0 })
  exactPredictions: number;

  @Column({ type: 'int', name: 'correct_outcomes', default: 0 })
  correctOutcomes: number;

  @Column({ type: 'int', name: 'total_predictions', default: 0 })
  totalPredictions: number;
}

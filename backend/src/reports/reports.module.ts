import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MonthlyExpense } from '../monthly-expenses/entities/monthly-expense.entity';
import { ExpensePayment } from '../expense-payments/entities/expense-payment.entity';
import { ExpenseCategory } from '../expense-categories/entities/expense-category.entity';
import { User } from '../users/entities/user.entity';
import { MonthlyPeriod } from '../monthly-periods/entities/monthly-period.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthlyExpense,
      ExpensePayment,
      ExpenseCategory,
      User,
      MonthlyPeriod,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

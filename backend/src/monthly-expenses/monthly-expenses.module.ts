import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyExpensesController } from './monthly-expenses.controller';
import { MonthlyExpensesService } from './monthly-expenses.service';
import { MonthlyExpense } from './entities/monthly-expense.entity';
import { MonthlyPeriodsModule } from '../monthly-periods/monthly-periods.module';
import { ExpenseCategoriesModule } from '../expense-categories/expense-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonthlyExpense]),
    MonthlyPeriodsModule,
    ExpenseCategoriesModule,
  ],
  controllers: [MonthlyExpensesController],
  providers: [MonthlyExpensesService],
  exports: [MonthlyExpensesService],
})
export class MonthlyExpensesModule {}

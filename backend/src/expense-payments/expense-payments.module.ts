import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensePaymentsController } from './expense-payments.controller';
import { ExpensePaymentsService } from './expense-payments.service';
import { ExpensePayment } from './entities/expense-payment.entity';
import { MonthlyPeriodsModule } from '../monthly-periods/monthly-periods.module';
import { ExpenseCategoriesModule } from '../expense-categories/expense-categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpensePayment]),
    MonthlyPeriodsModule,
    ExpenseCategoriesModule,
    UsersModule,
  ],
  controllers: [ExpensePaymentsController],
  providers: [ExpensePaymentsService],
  exports: [ExpensePaymentsService],
})
export class ExpensePaymentsModule {}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MonthlyPeriodsModule } from './monthly-periods/monthly-periods.module';
import { ExpenseCategoriesModule } from './expense-categories/expense-categories.module';
import { MonthlyExpensesModule } from './monthly-expenses/monthly-expenses.module';
import { ExpensePaymentsModule } from './expense-payments/expense-payments.module';
import { CashContributionsModule } from './cash-contributions/cash-contributions.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createDatabaseConfig(configService),
    }),
    AuthModule,
    UsersModule,
    MonthlyPeriodsModule,
    ExpenseCategoriesModule,
    MonthlyExpensesModule,
    ExpensePaymentsModule,
    CashContributionsModule,
    ReportsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

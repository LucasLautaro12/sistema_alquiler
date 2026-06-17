import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
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
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { PredictionsModule } from './predictions/predictions.module';
import { RankingsModule } from './rankings/rankings.module';
import { SyncModule } from './sync/sync.module';
import { ProdeAdminModule } from './prode-admin/prode-admin.module';
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
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MonthlyPeriodsModule,
    ExpenseCategoriesModule,
    MonthlyExpensesModule,
    ExpensePaymentsModule,
    CashContributionsModule,
    ReportsModule,
    AuditModule,
    TeamsModule,
    TournamentsModule,
    MatchesModule,
    PredictionsModule,
    RankingsModule,
    SyncModule,
    ProdeAdminModule,
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

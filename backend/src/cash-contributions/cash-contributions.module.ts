import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashContributionsController } from './cash-contributions.controller';
import { CashContributionsService } from './cash-contributions.service';
import { CashContribution } from './entities/cash-contribution.entity';
import { MonthlyPeriodsModule } from '../monthly-periods/monthly-periods.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashContribution]),
    MonthlyPeriodsModule,
    UsersModule,
  ],
  controllers: [CashContributionsController],
  providers: [CashContributionsService],
  exports: [CashContributionsService],
})
export class CashContributionsModule {}

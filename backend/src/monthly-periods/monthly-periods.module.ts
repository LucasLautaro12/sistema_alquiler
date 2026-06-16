import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyPeriodsController } from './monthly-periods.controller';
import { MonthlyPeriodsService } from './monthly-periods.service';
import { MonthlyPeriod } from './entities/monthly-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPeriod])],
  controllers: [MonthlyPeriodsController],
  providers: [MonthlyPeriodsService],
  exports: [MonthlyPeriodsService],
})
export class MonthlyPeriodsModule {}

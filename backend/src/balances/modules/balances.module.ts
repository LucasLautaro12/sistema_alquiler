import { Module } from '@nestjs/common';
import { BalancesService } from '../service/balances.service';

@Module({
  providers: [BalancesService],
})
export class BalancesModule {}

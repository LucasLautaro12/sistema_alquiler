import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from '../entities/balances.entity';
import { GastoMensual } from '../../gastos-mensuales/entities/gasto-mensual.entity';
import { Usuarios } from '../../usuarios/entities/usuario.entity';
import { BalancesService } from '../service/balances.service';
import { BalancesController } from '../controller/balances.controller';
import { GastosMensualesModule } from '../../gastos-mensuales/gastos-mensuales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance, GastoMensual, Usuarios]),
    GastosMensualesModule,
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}
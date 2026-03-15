// src/gastos-mensuales/gastos-mensuales.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastoMensual } from './entities/gasto-mensual.entity';
import { GastosMensualesService } from './service/gastos-mensuales.service';
import { GastosMensualesController } from './controller/gastos-mensuales.controller';
import { UsuariosModule } from '../usuarios/modules/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastoMensual]),
    UsuariosModule,
  ],
  controllers: [GastosMensualesController],
  providers: [GastosMensualesService],
  exports: [GastosMensualesService],
})
export class GastosMensualesModule {}

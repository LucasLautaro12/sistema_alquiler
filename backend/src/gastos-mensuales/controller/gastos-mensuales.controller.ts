// src/gastos-mensuales/controller/gastos-mensuales.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { GastosMensualesService } from '../service/gastos-mensuales.service';
import { CreateGastoMensualDto } from '../dtos/create-gasto-mensual.dto';
import { UpdateGastoMensualDto } from '../dtos/update-gasto-mensual.dto';

@Controller('gastos-mensuales')
export class GastosMensualesController {
  constructor(private readonly gastosMensualesService: GastosMensualesService) {}

  /**
   * POST /gastos-mensuales
   * Registrar los gastos de un mes (alquiler, gas, luz/agua, expensas + pagadores)
   */
  @Post()
  create(@Body() createGastoMensualDto: CreateGastoMensualDto) {
    return this.gastosMensualesService.create(createGastoMensualDto);
  }

  /**
   * GET /gastos-mensuales
   * Listar todos los meses registrados (más reciente primero)
   */
  @Get()
  findAll() {
    return this.gastosMensualesService.findAll();
  }

  /**
   * GET /gastos-mensuales/:id
   * Obtener el registro de un mes por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gastosMensualesService.findOne(id);
  }

  /**
   * PATCH /gastos-mensuales/:id
   * Actualizar montos o pagadores de un mes registrado
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGastoMensualDto: UpdateGastoMensualDto,
  ) {
    return this.gastosMensualesService.update(id, updateGastoMensualDto);
  }

  /**
   * GET /gastos-mensuales/:id/resumen
   * Obtener resumen mensual: total, monto base, y cuánto debe/pagó cada usuario
   */
  @Get(':id/resumen')
  getResumen(@Param('id', ParseIntPipe) id: number) {
    return this.gastosMensualesService.getResumen(id);
  }
}

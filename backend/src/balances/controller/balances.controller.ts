import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BalancesService } from '../service/balances.service';

@ApiTags('Balances')
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Post('generar/:anio/:mes')
  @ApiOperation({
    summary: 'Generar (o regenerar) balances para un mes',
    description:
      'Calcula y persiste el balance de cada usuario para el mes indicado. ' +
      'Si ya existían balances para ese mes, los sobreescribe con los valores actuales.',
  })
  @ApiParam({ name: 'anio', description: 'Año', example: 2026 })
  @ApiParam({ name: 'mes', description: 'Mes (1-12)', example: 1 })
  @ApiResponse({ status: 201, description: 'Balances generados exitosamente' })
  @ApiResponse({ status: 404, description: 'No existe gasto mensual para ese mes/año' })
  generarBalances(
    @Param('anio', ParseIntPipe) anio: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return this.balancesService.generarBalancesMensual(mes, anio);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los balances' })
  @ApiResponse({ status: 200, description: 'Lista completa de balances' })
  findAll() {
    return this.balancesService.findAll();
  }

  @Get('mes/:anio/:mes')
  @ApiOperation({
    summary: 'Obtener balances de un mes específico',
    description: 'Devuelve los balances guardados para el mes/año indicado.',
  })
  @ApiParam({ name: 'anio', description: 'Año', example: 2026 })
  @ApiParam({ name: 'mes', description: 'Mes (1-12)', example: 1 })
  @ApiResponse({ status: 200, description: 'Balances del mes' })
  @ApiResponse({ status: 404, description: 'No existe gasto mensual para ese mes/año' })
  findByMesAnio(
    @Param('anio', ParseIntPipe) anio: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return this.balancesService.findByMesAnio(mes, anio);
  }

  @Get('usuario/:dni')
  @ApiOperation({ summary: 'Obtener todos los balances de un usuario' })
  @ApiParam({ name: 'dni', description: 'DNI del usuario', example: 12345678 })
  @ApiResponse({ status: 200, description: 'Historial de balances del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUsuario(@Param('dni', ParseIntPipe) dni: number) {
    return this.balancesService.findByUsuario(dni);
  }
}
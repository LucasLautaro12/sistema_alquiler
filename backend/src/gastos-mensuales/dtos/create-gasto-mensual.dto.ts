// src/gastos-mensuales/dtos/create-gasto-mensual.dto.ts

import {
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateGastoMensualDto {
  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;

  @IsInt()
  @Min(2000)
  anio: number;

  @IsNumber()
  @Min(0)
  alquiler: number;

  @IsNumber()
  @Min(0)
  gas: number;

  @IsNumber()
  @Min(0)
  luz_agua: number;

  @IsNumber()
  @Min(0)
  expensas: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_gas_dni?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_luz_agua_dni?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_expensas_dni?: number;
}

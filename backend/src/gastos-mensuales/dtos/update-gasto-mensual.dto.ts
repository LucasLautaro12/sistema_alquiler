// src/gastos-mensuales/dtos/update-gasto-mensual.dto.ts

import {
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class UpdateGastoMensualDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mes?: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  anio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  alquiler?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  luz_agua?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expensas?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_gas_dni?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_luz_agua_dni?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  pagador_expensas_dni?: number | null;
}

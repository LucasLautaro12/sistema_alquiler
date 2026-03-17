import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GastoMensual } from '../entities/gasto-mensual.entity';
import { UsuarioResponseDto } from '../../usuarios/dtos/usuario-response.dto';

export class GastoMensualResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  mes: number;

  @ApiProperty({ example: 2026 })
  anio: number;

  @ApiProperty({ example: 600 })
  alquiler: number;

  @ApiProperty({ example: 100 })
  gas: number;

  @ApiProperty({ example: 100 })
  luz_agua: number;

  @ApiProperty({ example: 100 })
  expensas: number;

  @ApiProperty({ example: 900 })
  totalGastos: number;

  @ApiPropertyOptional({ type: () => UsuarioResponseDto })
  pagador_gas: UsuarioResponseDto | null;

  @ApiPropertyOptional({ type: () => UsuarioResponseDto })
  pagador_luz_agua: UsuarioResponseDto | null;

  @ApiPropertyOptional({ type: () => UsuarioResponseDto })
  pagador_expensas: UsuarioResponseDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: GastoMensual): GastoMensualResponseDto {
    const dto = new GastoMensualResponseDto();
    dto.id = entity.id;
    dto.mes = entity.mes;
    dto.anio = entity.anio;
    dto.alquiler = Number(entity.alquiler);
    dto.gas = Number(entity.gas);
    dto.luz_agua = Number(entity.luz_agua);
    dto.expensas = Number(entity.expensas);
    dto.totalGastos = dto.alquiler + dto.gas + dto.luz_agua + dto.expensas;
    dto.pagador_gas = entity.pagador_gas
      ? UsuarioResponseDto.fromEntity(entity.pagador_gas)
      : null;
    dto.pagador_luz_agua = entity.pagador_luz_agua
      ? UsuarioResponseDto.fromEntity(entity.pagador_luz_agua)
      : null;
    dto.pagador_expensas = entity.pagador_expensas
      ? UsuarioResponseDto.fromEntity(entity.pagador_expensas)
      : null;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntities(entities: GastoMensual[]): GastoMensualResponseDto[] {
    return entities.map(GastoMensualResponseDto.fromEntity);
  }
}
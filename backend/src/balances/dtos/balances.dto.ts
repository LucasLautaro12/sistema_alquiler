import { ApiProperty } from '@nestjs/swagger';
import { Balance } from '../entities/balances.entity';
import { UsuarioResponseDto } from '../../usuarios/dtos/usuario-response.dto';

export class BalanceResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => UsuarioResponseDto })
  usuario: UsuarioResponseDto;

  @ApiProperty({ example: 1 })
  mes: number;

  @ApiProperty({ example: 2026 })
  anio: number;

  @ApiProperty({ example: 300 })
  montoBase: number;

  @ApiProperty({ example: 100 })
  totalPagado: number;

  @ApiProperty({ example: 200 })
  deudaFinal: number;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: Balance): BalanceResponseDto {
    const dto = new BalanceResponseDto();
    dto.id = entity.id;
    dto.usuario = UsuarioResponseDto.fromEntity(entity.usuario);
    dto.mes = entity.gastoMensual.mes;
    dto.anio = entity.gastoMensual.anio;
    dto.montoBase = Number(entity.montoBase);
    dto.totalPagado = Number(entity.totalPagado);
    dto.deudaFinal = Number(entity.deudaFinal);
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntities(entities: Balance[]): BalanceResponseDto[] {
    return entities.map(BalanceResponseDto.fromEntity);
  }
}
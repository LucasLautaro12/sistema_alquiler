import { ApiProperty } from '@nestjs/swagger';
import { Usuarios } from '../entities/usuario.entity';

export class UsuarioResponseDto {
  @ApiProperty({ example: 12345678 })
  dni: number;

  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  updatedAt: Date;

  static fromEntity(entity: Usuarios): UsuarioResponseDto {
    const dto = new UsuarioResponseDto();
    dto.dni = entity.dni;
    dto.nombre = entity.nombre;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntities(entities: Usuarios[]): UsuarioResponseDto[] {
    return entities.map(UsuarioResponseDto.fromEntity);
  }
}
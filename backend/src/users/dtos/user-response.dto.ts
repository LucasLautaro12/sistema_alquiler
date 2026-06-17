import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 12345678 })
  dni: number;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({ example: 1 })
  createdBy: number | null;

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: 1 })
  updatedBy: number | null;

  @ApiProperty({ example: 0 })
  totalPoints: number;

  @ApiProperty({ example: 0 })
  exactPredictions: number;

  @ApiProperty({ example: 0 })
  correctOutcomes: number;

  @ApiProperty({ example: 0 })
  totalPredictions: number;

  static fromEntity(entity: User): UserResponseDto {
    return {
      id: entity.id,
      dni: entity.dni,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      totalPoints: entity.totalPoints,
      exactPredictions: entity.exactPredictions,
      correctOutcomes: entity.correctOutcomes,
      totalPredictions: entity.totalPredictions,
    };
  }

  static fromEntities(entities: User[]): UserResponseDto[] {
    return entities.map(UserResponseDto.fromEntity);
  }
}

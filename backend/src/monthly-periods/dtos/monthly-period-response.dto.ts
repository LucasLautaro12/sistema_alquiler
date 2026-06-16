import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonthlyPeriod } from '../entities/monthly-period.entity';

export class MonthlyPeriodResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: false })
  isClosed: boolean;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  createdBy: number | null;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  updatedBy: number | null;

  static fromEntity(entity: MonthlyPeriod): MonthlyPeriodResponseDto {
    return {
      id: entity.id,
      year: entity.year,
      month: entity.month,
      isClosed: entity.isClosed,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: MonthlyPeriod[]): MonthlyPeriodResponseDto[] {
    return entities.map(MonthlyPeriodResponseDto.fromEntity);
  }
}

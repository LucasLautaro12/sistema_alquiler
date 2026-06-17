import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tournament } from '../entities/tournament.entity';

export class TournamentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'World Cup 2026' })
  name: string;

  @ApiProperty({ example: '2026' })
  season: string;

  @ApiProperty({ example: '2026-06-11T00:00:00.000Z' })
  startDate: Date;

  @ApiPropertyOptional({ example: '2026-07-19T00:00:00.000Z' })
  endDate: Date | null;

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

  static fromEntity(entity: Tournament): TournamentResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      season: entity.season,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: Tournament[]): TournamentResponseDto[] {
    return entities.map(TournamentResponseDto.fromEntity);
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prediction } from '../entities/prediction.entity';

export class PredictionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Juan Pérez' })
  userName: string;

  @ApiProperty({ example: 1 })
  matchId: number;

  @ApiProperty({ example: 'Argentina vs Brasil' })
  matchName: string;

  @ApiProperty({ example: 2 })
  homeScore: number;

  @ApiProperty({ example: 1 })
  awayScore: number;

  @ApiProperty({ example: 0 })
  points: number;

  @ApiProperty({ example: false })
  isExact: boolean;

  @ApiProperty({ example: false })
  isCorrectOutcome: boolean;

  @ApiProperty({ example: false })
  isScored: boolean;

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

  static fromEntity(entity: Prediction): PredictionResponseDto {
    const homeName = entity.match?.homeTeam?.name ?? '';
    const awayName = entity.match?.awayTeam?.name ?? '';
    return {
      id: entity.id,
      userId: entity.userId,
      userName: entity.user?.name ?? '',
      matchId: entity.matchId,
      matchName: homeName && awayName ? `${homeName} vs ${awayName}` : '',
      homeScore: entity.homeScore,
      awayScore: entity.awayScore,
      points: entity.points,
      isExact: entity.isExact,
      isCorrectOutcome: entity.isCorrectOutcome,
      isScored: entity.isScored,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: Prediction[]): PredictionResponseDto[] {
    return entities.map(PredictionResponseDto.fromEntity);
  }
}

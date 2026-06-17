import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match, MatchStatus, MatchStage } from '../entities/match.entity';

export class MatchResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  tournamentId: number;

  @ApiProperty({ example: 'World Cup 2026' })
  tournamentName: string;

  @ApiProperty({ example: 1 })
  homeTeamId: number;

  @ApiProperty({ example: 'Argentina' })
  homeTeamName: string;

  @ApiPropertyOptional({ example: 'https://example.com/flag.png' })
  homeTeamFlag: string | null;

  @ApiProperty({ example: 2 })
  awayTeamId: number;

  @ApiProperty({ example: 'Brasil' })
  awayTeamName: string;

  @ApiPropertyOptional({ example: 'https://example.com/flag.png' })
  awayTeamFlag: string | null;

  @ApiProperty({ example: '2026-06-11T18:00:00.000Z' })
  matchDate: Date;

  @ApiProperty({ example: 'scheduled' })
  matchStatus: MatchStatus;

  @ApiProperty({ example: 'group_stage' })
  stage: MatchStage;

  @ApiPropertyOptional({ example: 2 })
  homeScore: number | null;

  @ApiPropertyOptional({ example: 1 })
  awayScore: number | null;

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

  static fromEntity(entity: Match): MatchResponseDto {
    return {
      id: entity.id,
      tournamentId: entity.tournamentId,
      tournamentName: entity.tournament?.name ?? '',
      homeTeamId: entity.homeTeamId,
      homeTeamName: entity.homeTeam?.name ?? '',
      homeTeamFlag: entity.homeTeam?.flagUrl ?? null,
      awayTeamId: entity.awayTeamId,
      awayTeamName: entity.awayTeam?.name ?? '',
      awayTeamFlag: entity.awayTeam?.flagUrl ?? null,
      matchDate: entity.matchDate,
      matchStatus: entity.matchStatus,
      stage: entity.stage,
      homeScore: entity.homeScore,
      awayScore: entity.awayScore,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: Match[]): MatchResponseDto[] {
    return entities.map(MatchResponseDto.fromEntity);
  }
}

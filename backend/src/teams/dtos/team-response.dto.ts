import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

export class TeamResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Argentina' })
  name: string;

  @ApiProperty({ example: 'ARG' })
  code: string;

  @ApiProperty({ example: 'Argentina' })
  country: string;

  @ApiPropertyOptional({ example: 'https://example.com/flag.png' })
  flagUrl: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl: string | null;

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

  static fromEntity(entity: Team): TeamResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      country: entity.country,
      flagUrl: entity.flagUrl,
      logoUrl: entity.logoUrl,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: Team[]): TeamResponseDto[] {
    return entities.map(TeamResponseDto.fromEntity);
  }
}

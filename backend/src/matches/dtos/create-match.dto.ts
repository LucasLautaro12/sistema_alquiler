import { IsInt, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty() @IsInt() tournamentId: number;
  @ApiProperty() @IsInt() homeTeamId: number;
  @ApiProperty() @IsInt() awayTeamId: number;
  @ApiProperty() @IsString() @IsNotEmpty() matchDate: string;
  @ApiProperty() @IsString() @IsNotEmpty() stage: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() matchday?: number;
}

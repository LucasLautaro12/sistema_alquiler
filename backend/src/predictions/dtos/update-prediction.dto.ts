import { IsInt, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePredictionDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) homeScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) awayScore?: number;
}

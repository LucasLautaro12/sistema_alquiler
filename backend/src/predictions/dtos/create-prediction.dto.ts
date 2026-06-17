import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePredictionDto {
  @ApiProperty() @IsInt() matchId: number;
  @ApiProperty() @IsInt() @Min(0) homeScore: number;
  @ApiProperty() @IsInt() @Min(0) awayScore: number;
}

import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMonthlyExpenseDto {
  @ApiPropertyOptional({ example: 650000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}

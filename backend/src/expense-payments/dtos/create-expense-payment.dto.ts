import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpensePaymentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  monthlyPeriodId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  expenseCategoryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ example: 'Pago de gas enero' })
  @IsOptional()
  @IsString()
  notes?: string;
}

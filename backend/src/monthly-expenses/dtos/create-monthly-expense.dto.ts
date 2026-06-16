import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonthlyExpenseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  monthlyPeriodId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  expenseCategoryId: number;

  @ApiProperty({ example: 600000 })
  @IsNumber()
  @Min(0)
  amount: number;
}

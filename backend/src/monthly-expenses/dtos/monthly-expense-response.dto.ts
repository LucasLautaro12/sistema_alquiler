import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonthlyExpense } from '../entities/monthly-expense.entity';
import { ExpenseCategoryResponseDto } from '../../expense-categories/dtos/expense-category-response.dto';

export class MonthlyExpenseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  monthlyPeriodId: number;

  @ApiProperty({ type: () => ExpenseCategoryResponseDto })
  expenseCategory: ExpenseCategoryResponseDto;

  @ApiProperty({ example: 600000 })
  amount: number;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  createdBy: number | null;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  updatedBy: number | null;

  static fromEntity(entity: MonthlyExpense): MonthlyExpenseResponseDto {
    return {
      id: entity.id,
      monthlyPeriodId: entity.monthlyPeriod?.id ?? 0,
      expenseCategory: ExpenseCategoryResponseDto.fromEntity(entity.expenseCategory),
      amount: Number(entity.amount),
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: MonthlyExpense[]): MonthlyExpenseResponseDto[] {
    return entities.map(MonthlyExpenseResponseDto.fromEntity);
  }
}

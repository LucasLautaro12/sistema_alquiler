import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpensePayment } from '../entities/expense-payment.entity';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { ExpenseCategoryResponseDto } from '../../expense-categories/dtos/expense-category-response.dto';

export class ExpensePaymentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  monthlyPeriodId: number;

  @ApiProperty({ type: () => ExpenseCategoryResponseDto })
  expenseCategory: ExpenseCategoryResponseDto;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 50000 })
  amount: number;

  @ApiProperty({ example: '2026-01-15' })
  paymentDate: Date;

  @ApiPropertyOptional({ example: 'Pago de gas enero' })
  notes: string | null;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: ExpensePayment): ExpensePaymentResponseDto {
    return {
      id: entity.id,
      monthlyPeriodId: entity.monthlyPeriod?.id ?? 0,
      expenseCategory: ExpenseCategoryResponseDto.fromEntity(entity.expenseCategory),
      user: UserResponseDto.fromEntity(entity.user),
      amount: Number(entity.amount),
      paymentDate: entity.paymentDate,
      notes: entity.notes,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromEntities(entities: ExpensePayment[]): ExpensePaymentResponseDto[] {
    return entities.map(ExpensePaymentResponseDto.fromEntity);
  }
}

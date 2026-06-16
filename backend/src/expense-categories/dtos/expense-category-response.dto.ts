import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '../entities/expense-category.entity';

export class ExpenseCategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alquiler' })
  name: string;

  @ApiProperty({ example: 'RENT' })
  code: string;

  @ApiPropertyOptional({ example: 'Pago mensual de alquiler' })
  description: string | null;

  @ApiProperty({ example: true })
  isCashPayment: boolean;

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

  static fromEntity(entity: ExpenseCategory): ExpenseCategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      description: entity.description,
      isCashPayment: entity.isCashPayment,
      status: entity.status,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }

  static fromEntities(entities: ExpenseCategory[]): ExpenseCategoryResponseDto[] {
    return entities.map(ExpenseCategoryResponseDto.fromEntity);
  }
}

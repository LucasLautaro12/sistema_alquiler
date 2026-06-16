import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CashContribution } from '../entities/cash-contribution.entity';
import { UserResponseDto } from '../../users/dtos/user-response.dto';

export class CashContributionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  monthlyPeriodId: number;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 100000 })
  amount: number;

  @ApiProperty({ example: '2026-01-20' })
  paymentDate: Date;

  @ApiPropertyOptional({ example: 'Contribución efectivo enero' })
  notes: string | null;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: CashContribution): CashContributionResponseDto {
    return {
      id: entity.id,
      monthlyPeriodId: entity.monthlyPeriod?.id ?? 0,
      user: UserResponseDto.fromEntity(entity.user),
      amount: Number(entity.amount),
      paymentDate: entity.paymentDate,
      notes: entity.notes,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromEntities(entities: CashContribution[]): CashContributionResponseDto[] {
    return entities.map(CashContributionResponseDto.fromEntity);
  }
}

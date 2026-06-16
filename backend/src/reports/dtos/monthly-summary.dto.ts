import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Juan Pérez' })
  userName: string;

  @ApiProperty({ example: 400000 })
  sharePerUser: number;

  @ApiProperty({ example: 300000 })
  amountAlreadyPaid: number;

  @ApiProperty({ example: 100000 })
  cashToPay: number;
}

export class CategoryDetailDto {
  @ApiProperty({ example: 'Gas' })
  categoryName: string;

  @ApiProperty({ example: 50000 })
  amount: number;
}

export class MonthlySummaryDto {
  @ApiProperty({ example: 1 })
  periodId: number;

  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({ example: 1200000 })
  totalExpenses: number;

  @ApiProperty({ example: 3 })
  activeUsers: number;

  @ApiProperty({ example: 400000 })
  sharePerUser: number;

  @ApiProperty()
  rentAmount: number;

  @ApiProperty({ type: [CategoryDetailDto] })
  categoryDetails: CategoryDetailDto[];

  @ApiProperty({ type: [UserSummaryDto] })
  userSummaries: UserSummaryDto[];
}

export class CategoryHistoryDto {
  @ApiProperty({ example: 'Gas' })
  categoryName: string;

  @ApiProperty({ example: 'GAS' })
  categoryCode: string;

  @ApiProperty({ type: [Object] })
  history: { period: string; amount: number }[];
}

export class UserPaymentHistoryDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Juan Pérez' })
  userName: string;

  @ApiProperty({ type: [Object] })
  payments: {
    period: string;
    category: string;
    amount: number;
    paymentDate: string;
  }[];

  @ApiProperty({ example: 1500000 })
  totalPaid: number;
}

export class ComparisonDto {
  @ApiProperty()
  currentPeriod: MonthlySummaryDto;

  @ApiProperty()
  previousPeriod: MonthlySummaryDto;

  @ApiProperty({ example: 10.5 })
  percentageChange: number;
}

export class TrendDto {
  @ApiProperty({ type: [Object] })
  data: {
    period: string;
    totalExpenses: number;
    rent: number;
    gas: number;
    waterElectricity: number;
    limsa: number;
    buildingFees: number;
  }[];
}

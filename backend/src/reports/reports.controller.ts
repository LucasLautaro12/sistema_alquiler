import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import {
  MonthlySummaryDto,
  CategoryHistoryDto,
  UserPaymentHistoryDto,
  ComparisonDto,
  TrendDto,
} from './dtos/monthly-summary.dto';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly-summary/:periodId')
  @ApiOperation({ summary: 'Resumen mensual con cálculo de deudas' })
  async getMonthlySummary(
    @Param('periodId', ParseIntPipe) periodId: number,
  ): Promise<MonthlySummaryDto> {
    return this.reportsService.getMonthlySummary(periodId);
  }

  @Get('category-history')
  @ApiOperation({ summary: 'Historial de gastos por categoría' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
  })
  async getCategoryHistory(
    @Query('categoryId') categoryId?: number,
  ): Promise<CategoryHistoryDto[]> {
    return this.reportsService.getCategoryHistory(
      categoryId ? Number(categoryId) : undefined,
    );
  }

  @Get('user-payments')
  @ApiOperation({ summary: 'Historial de pagos por usuario' })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
  })
  async getUserPaymentHistory(
    @Query('userId') userId?: number,
  ): Promise<UserPaymentHistoryDto[]> {
    return this.reportsService.getUserPaymentHistory(
      userId ? Number(userId) : undefined,
    );
  }

  @Get('comparison/:currentPeriodId/:previousPeriodId')
  @ApiOperation({ summary: 'Comparación entre dos meses' })
  async getComparison(
    @Param('currentPeriodId', ParseIntPipe) currentPeriodId: number,
    @Param('previousPeriodId', ParseIntPipe) previousPeriodId: number,
  ): Promise<ComparisonDto> {
    return this.reportsService.getMonthlyComparison(
      currentPeriodId,
      previousPeriodId,
    );
  }

  @Get('trends')
  @ApiOperation({ summary: 'Tendencias históricas para gráficos' })
  async getTrends(): Promise<TrendDto> {
    return this.reportsService.getTrends();
  }
}

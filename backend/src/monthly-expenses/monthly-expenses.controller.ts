import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MonthlyExpensesService } from './monthly-expenses.service';
import { CreateMonthlyExpenseDto } from './dtos/create-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dtos/update-monthly-expense.dto';
import { MonthlyExpenseResponseDto } from './dtos/monthly-expense-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Gastos Mensuales')
@ApiBearerAuth()
@Controller('monthly-expenses')
export class MonthlyExpensesController {
  constructor(
    private readonly expensesService: MonthlyExpensesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los gastos mensuales' })
  async findAll(): Promise<MonthlyExpenseResponseDto[]> {
    const expenses = await this.expensesService.findAll();
    return MonthlyExpenseResponseDto.fromEntities(expenses);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gasto mensual por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MonthlyExpenseResponseDto> {
    const expense = await this.expensesService.findById(id);
    return MonthlyExpenseResponseDto.fromEntity(expense);
  }

  @Get('period/:periodId')
  @ApiOperation({ summary: 'Obtener gastos por período' })
  async findByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
  ): Promise<MonthlyExpenseResponseDto[]> {
    const expenses = await this.expensesService.findByPeriod(periodId);
    return MonthlyExpenseResponseDto.fromEntities(expenses);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar gasto mensual' })
  async create(
    @Body() dto: CreateMonthlyExpenseDto,
    @CurrentUser() user?: User,
  ): Promise<MonthlyExpenseResponseDto> {
    const expense = await this.expensesService.create(dto, user?.id);
    return MonthlyExpenseResponseDto.fromEntity(expense);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar monto de gasto mensual' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMonthlyExpenseDto,
    @CurrentUser() user?: User,
  ): Promise<MonthlyExpenseResponseDto> {
    const expense = await this.expensesService.update(id, dto, user?.id);
    return MonthlyExpenseResponseDto.fromEntity(expense);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gasto mensual (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.expensesService.softDelete(id, user?.id);
  }
}

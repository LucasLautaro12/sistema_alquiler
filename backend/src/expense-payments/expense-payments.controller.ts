import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensePaymentsService } from './expense-payments.service';
import { CreateExpensePaymentDto } from './dtos/create-expense-payment.dto';
import { ExpensePaymentResponseDto } from './dtos/expense-payment-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Pagos de Gastos')
@ApiBearerAuth()
@Controller('expense-payments')
export class ExpensePaymentsController {
  constructor(
    private readonly paymentsService: ExpensePaymentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos de gastos' })
  async findAll(): Promise<ExpensePaymentResponseDto[]> {
    const payments = await this.paymentsService.findAll();
    return ExpensePaymentResponseDto.fromEntities(payments);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpensePaymentResponseDto> {
    const payment = await this.paymentsService.findById(id);
    return ExpensePaymentResponseDto.fromEntity(payment);
  }

  @Get('period/:periodId')
  @ApiOperation({ summary: 'Obtener pagos por período' })
  async findByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
  ): Promise<ExpensePaymentResponseDto[]> {
    const payments = await this.paymentsService.findByPeriod(periodId);
    return ExpensePaymentResponseDto.fromEntities(payments);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener pagos por usuario' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ExpensePaymentResponseDto[]> {
    const payments = await this.paymentsService.findByUser(userId);
    return ExpensePaymentResponseDto.fromEntities(payments);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Obtener pagos por categoría' })
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<ExpensePaymentResponseDto[]> {
    const payments = await this.paymentsService.findByCategory(categoryId);
    return ExpensePaymentResponseDto.fromEntities(payments);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar pago de gasto' })
  async create(
    @Body() dto: CreateExpensePaymentDto,
    @CurrentUser() user?: User,
  ): Promise<ExpensePaymentResponseDto> {
    const payment = await this.paymentsService.create(dto, user?.id);
    return ExpensePaymentResponseDto.fromEntity(payment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pago (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.paymentsService.softDelete(id, user?.id);
  }
}

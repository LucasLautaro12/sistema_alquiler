import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MonthlyPeriodsService } from './monthly-periods.service';
import { CreateMonthlyPeriodDto } from './dtos/create-monthly-period.dto';
import { MonthlyPeriodResponseDto } from './dtos/monthly-period-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Períodos Mensuales')
@ApiBearerAuth()
@Controller('monthly-periods')
export class MonthlyPeriodsController {
  constructor(private readonly periodsService: MonthlyPeriodsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los períodos mensuales' })
  async findAll(): Promise<MonthlyPeriodResponseDto[]> {
    const periods = await this.periodsService.findAll();
    return MonthlyPeriodResponseDto.fromEntities(periods);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener período por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MonthlyPeriodResponseDto> {
    const period = await this.periodsService.findById(id);
    return MonthlyPeriodResponseDto.fromEntity(period);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo período mensual' })
  async create(
    @Body() dto: CreateMonthlyPeriodDto,
    @CurrentUser() user?: User,
  ): Promise<MonthlyPeriodResponseDto> {
    const period = await this.periodsService.create(dto, user?.id);
    return MonthlyPeriodResponseDto.fromEntity(period);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Cerrar período mensual' })
  async close(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<MonthlyPeriodResponseDto> {
    const period = await this.periodsService.close(id, user?.id);
    return MonthlyPeriodResponseDto.fromEntity(period);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar período (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.periodsService.softDelete(id, user?.id);
  }
}

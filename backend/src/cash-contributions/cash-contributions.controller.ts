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
import { CashContributionsService } from './cash-contributions.service';
import { CreateCashContributionDto } from './dtos/create-cash-contribution.dto';
import { CashContributionResponseDto } from './dtos/cash-contribution-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Contribuciones en Efectivo')
@ApiBearerAuth()
@Controller('cash-contributions')
export class CashContributionsController {
  constructor(
    private readonly contributionsService: CashContributionsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las contribuciones en efectivo' })
  async findAll(): Promise<CashContributionResponseDto[]> {
    const contributions = await this.contributionsService.findAll();
    return CashContributionResponseDto.fromEntities(contributions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener contribución por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CashContributionResponseDto> {
    const contribution = await this.contributionsService.findById(id);
    return CashContributionResponseDto.fromEntity(contribution);
  }

  @Get('period/:periodId')
  @ApiOperation({ summary: 'Obtener contribuciones por período' })
  async findByPeriod(
    @Param('periodId', ParseIntPipe) periodId: number,
  ): Promise<CashContributionResponseDto[]> {
    const contributions = await this.contributionsService.findByPeriod(periodId);
    return CashContributionResponseDto.fromEntities(contributions);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener contribuciones por usuario' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CashContributionResponseDto[]> {
    const contributions = await this.contributionsService.findByUser(userId);
    return CashContributionResponseDto.fromEntities(contributions);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar contribución en efectivo' })
  async create(
    @Body() dto: CreateCashContributionDto,
    @CurrentUser() user?: User,
  ): Promise<CashContributionResponseDto> {
    const contribution = await this.contributionsService.create(dto, user?.id);
    return CashContributionResponseDto.fromEntity(contribution);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar contribución (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.contributionsService.softDelete(id, user?.id);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { MatchResponseDto } from './dtos/match-response.dto';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UpdateMatchResultDto } from './dtos/update-match-result.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Partidos')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar partidos con filtros' })
  @ApiQuery({ name: 'matchStatus', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'tournamentId', required: false })
  async findAll(
    @Query('matchStatus') matchStatus?: string,
    @Query('stage') stage?: string,
    @Query('tournamentId') tournamentId?: string,
  ): Promise<MatchResponseDto[]> {
    const matches = await this.matchesService.findAll({
      matchStatus,
      stage,
      tournamentId: tournamentId ? parseInt(tournamentId, 10) : undefined,
    });
    return MatchResponseDto.fromEntities(matches);
  }

  @Public()
  @Get('upcoming')
  @ApiOperation({ summary: 'Listar próximos partidos' })
  async findUpcoming(): Promise<MatchResponseDto[]> {
    const matches = await this.matchesService.findUpcoming();
    return MatchResponseDto.fromEntities(matches);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener partido por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MatchResponseDto> {
    const match = await this.matchesService.findById(id);
    return MatchResponseDto.fromEntity(match);
  }

  @Post()
  @ApiOperation({ summary: 'Crear partido' })
  async create(
    @Body() dto: CreateMatchDto,
    @CurrentUser() user?: User,
  ): Promise<MatchResponseDto> {
    const match = await this.matchesService.create(dto, user?.id);
    return MatchResponseDto.fromEntity(match);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar partido' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMatchDto>,
    @CurrentUser() user?: User,
  ): Promise<MatchResponseDto> {
    const match = await this.matchesService.update(id, dto as any, user?.id);
    return MatchResponseDto.fromEntity(match);
  }

  @Patch(':id/result')
  @ApiOperation({ summary: 'Actualizar resultado del partido' })
  async updateResult(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchResultDto,
    @CurrentUser() user?: User,
  ): Promise<MatchResponseDto> {
    const match = await this.matchesService.updateResult(id, dto, user?.id);
    return MatchResponseDto.fromEntity(match);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar partido (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.matchesService.softDelete(id, user?.id);
  }
}

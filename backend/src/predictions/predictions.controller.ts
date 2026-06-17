import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';
import { PredictionResponseDto } from './dtos/prediction-response.dto';
import { CreatePredictionDto } from './dtos/create-prediction.dto';
import { UpdatePredictionDto } from './dtos/update-prediction.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Pronósticos')
@ApiBearerAuth()
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener mis pronósticos' })
  async findMyPredictions(@CurrentUser() user: User): Promise<PredictionResponseDto[]> {
    const predictions = await this.predictionsService.findByUser(user.id);
    return PredictionResponseDto.fromEntities(predictions);
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: 'Obtener pronósticos de un partido' })
  async findByMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
  ): Promise<PredictionResponseDto[]> {
    const predictions = await this.predictionsService.findByMatch(matchId);
    return PredictionResponseDto.fromEntities(predictions);
  }

  @Post()
  @ApiOperation({ summary: 'Crear pronóstico' })
  async create(
    @Body() dto: CreatePredictionDto,
    @CurrentUser() user: User,
  ): Promise<PredictionResponseDto> {
    const prediction = await this.predictionsService.create(user.id, dto);
    return PredictionResponseDto.fromEntity(prediction);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pronóstico' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePredictionDto,
    @CurrentUser() user: User,
  ): Promise<PredictionResponseDto> {
    const prediction = await this.predictionsService.update(user.id, id, dto);
    return PredictionResponseDto.fromEntity(prediction);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pronóstico (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.predictionsService.softDelete(user.id, id);
  }
}

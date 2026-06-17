import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { TournamentResponseDto } from './dtos/tournament-response.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Torneos')
@ApiBearerAuth()
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los torneos' })
  async findAll(): Promise<TournamentResponseDto[]> {
    const tournaments = await this.tournamentsService.findAll();
    return TournamentResponseDto.fromEntities(tournaments);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener torneo por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TournamentResponseDto> {
    const tournament = await this.tournamentsService.findById(id);
    return TournamentResponseDto.fromEntity(tournament);
  }
}

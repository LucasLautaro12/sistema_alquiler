import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { TeamResponseDto } from './dtos/team-response.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Equipos')
@ApiBearerAuth()
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los equipos' })
  async findAll(): Promise<TeamResponseDto[]> {
    const teams = await this.teamsService.findAll();
    return TeamResponseDto.fromEntities(teams);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener equipo por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamResponseDto> {
    const team = await this.teamsService.findById(id);
    return TeamResponseDto.fromEntity(team);
  }
}

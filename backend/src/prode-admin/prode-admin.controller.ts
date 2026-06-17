import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProdeAdminService } from './prode-admin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Prode Admin')
@ApiBearerAuth()
@Controller('prode-admin')
export class ProdeAdminController {
  constructor(private readonly prodeAdminService: ProdeAdminService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Inicializar datos semilla (equipos, grupos, torneo)' })
  async seed(@CurrentUser() user?: User) {
    return this.prodeAdminService.seedAll(user?.id);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Obtener tabla de posiciones de todos los grupos' })
  async getGroupStandings(): Promise<any> {
    return this.prodeAdminService.getGroupStandings();
  }

  @Get('groups/:group')
  @ApiOperation({ summary: 'Obtener tabla de posiciones de un grupo' })
  async getGroupStanding(@Param('group') group: string): Promise<any> {
    return this.prodeAdminService.getGroupStanding(group.toUpperCase());
  }

  @Post('matches/bulk')
  @ApiOperation({ summary: 'Crear múltiples partidos a la vez' })
  async createBulkMatches(
    @Body() dto: { matches: any[] },
    @CurrentUser() user?: User,
  ) {
    return this.prodeAdminService.createBulkMatches(dto.matches, user?.id);
  }

  @Get('knockout-template')
  @ApiOperation({ summary: 'Obtener plantilla de llaves de eliminatorias' })
  getKnockoutTemplate() {
    return this.prodeAdminService.getKnockoutTemplate();
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RankingsService, RankingEntry } from './rankings.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Rankings')
@ApiBearerAuth()
@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener ranking global' })
  async getGlobalRanking(): Promise<RankingEntry[]> {
    return this.rankingsService.getGlobalRanking();
  }

  @Public()
  @Get('top')
  @ApiOperation({ summary: 'Obtener top usuarios' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopUsers(@Query('limit') limit?: string): Promise<RankingEntry[]> {
    return this.rankingsService.getTopUsers(limit ? parseInt(limit, 10) : 3);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener mi posición en el ranking' })
  async getMyPosition(@CurrentUser() user: User): Promise<RankingEntry | null> {
    return this.rankingsService.getUserPosition(user.id);
  }
}

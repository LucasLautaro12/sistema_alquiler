import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match, MatchStatus, MatchStage } from '../matches/entities/match.entity';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly apiUrl = 'https://api.football-data.org/v4';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {
    this.apiKey = this.configService.get<string>('FOOTBALL_DATA_API_KEY', '');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncMatches(): Promise<void> {
    this.logger.log('Iniciando sincronización de partidos...');
    try {
      const competitionId = this.configService.get<number>('WORLD_CUP_COMPETITION_ID', 2000);
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/competitions/${competitionId}/matches`, {
          headers: { 'X-Auth-Token': this.apiKey },
        }),
      );
      const tournament = await this.ensureTournament(data.competition);
      for (const matchData of data.matches) {
        const homeTeam = await this.upsertTeam(matchData.homeTeam);
        const awayTeam = await this.upsertTeam(matchData.awayTeam);
        const existing = await this.matchRepository.findOne({
          where: { externalId: matchData.id },
        });
        const match = {
          tournamentId: tournament.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          matchDate: new Date(matchData.utcDate),
          matchStatus: this.mapStatus(matchData.status),
          stage: this.mapStage(matchData.stage),
          homeScore: matchData.score?.fullTime?.home ?? null,
          awayScore: matchData.score?.fullTime?.away ?? null,
          externalId: matchData.id,
          matchday: matchData.matchday ?? null,
        };
        if (existing) {
          await this.matchRepository.update(existing.id, match);
          if (matchData.status === 'FINISHED' && match.homeScore !== null) {
            await this.handleFinishedMatch(existing.id);
          }
        } else {
          const created = this.matchRepository.create(match);
          await this.matchRepository.save(created);
        }
      }
      this.logger.log(`Sincronización completada: ${data.matches.length} partidos`);
    } catch (error) {
      this.logger.error('Error en sincronización de partidos', error instanceof Error ? error.message : error);
    }
  }

  private async ensureTournament(competitionData: any): Promise<Tournament> {
    const externalId = competitionData.id;
    let tournament = await this.tournamentRepository.findOne({
      where: { externalId },
    });
    if (!tournament) {
      tournament = this.tournamentRepository.create({
        name: competitionData.name ?? competitionData.emblem ?? 'World Cup',
        season: competitionData.currentSeason?.id?.toString() ?? '2026',
        startDate: new Date(competitionData.currentSeason?.startDate ?? '2026-06-11'),
        endDate: competitionData.currentSeason?.endDate ? new Date(competitionData.currentSeason.endDate) : null,
        externalId,
      });
      tournament = await this.tournamentRepository.save(tournament);
    }
    return tournament;
  }

  private async upsertTeam(teamData: any): Promise<Team> {
    const externalId = teamData.id;
    let team = await this.teamRepository.findOne({ where: { externalId } });
    if (!team) {
      team = this.teamRepository.create({
        name: teamData.name,
        code: teamData.tla ?? '',
        country: teamData.area?.name ?? teamData.name,
        flagUrl: teamData.crest ?? teamData.flag ?? null,
        logoUrl: teamData.crest ?? null,
        externalId,
        group: teamData.group ?? null,
      });
      team = await this.teamRepository.save(team);
    }
    return team;
  }

  private mapStatus(status: string): MatchStatus {
    switch (status) {
      case 'SCHEDULED': case 'TIMED': return MatchStatus.SCHEDULED;
      case 'LIVE': case 'IN_PLAY': case 'PAUSED': return MatchStatus.IN_PLAY;
      case 'FINISHED': case 'AWARDED': return MatchStatus.FINISHED;
      case 'POSTPONED': return MatchStatus.POSTPONED;
      case 'CANCELLED': return MatchStatus.CANCELLED;
      default: return MatchStatus.SCHEDULED;
    }
  }

  private mapStage(stage: string): MatchStage {
    switch (stage) {
      case 'GROUP_STAGE': case 'GROUP': return MatchStage.GROUP_STAGE;
      case 'ROUND_OF_32': case 'FIRST_ROUND': return MatchStage.ROUND_OF_32;
      case 'ROUND_OF_16': case 'LAST_16': return MatchStage.ROUND_OF_16;
      case 'QUARTER_FINALS': case 'QUARTERFINALS': return MatchStage.QUARTERFINALS;
      case 'SEMI_FINALS': case 'SEMIFINALS': return MatchStage.SEMIFINALS;
      case 'THIRD_PLACE': case 'THIRD_PLACE_PLAY_OFF': return MatchStage.THIRD_PLACE;
      case 'FINAL': return MatchStage.FINAL;
      default: return MatchStage.GROUP_STAGE;
    }
  }

  private async handleFinishedMatch(matchId: number): Promise<void> {
    this.logger.log(`Partido finalizado detectado: ID ${matchId}`);
  }
}

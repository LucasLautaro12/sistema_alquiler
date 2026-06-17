import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match, MatchStatus, MatchStage } from '../matches/entities/match.entity';
import { TeamsService } from '../teams/teams.service';
import { PredictionsService } from '../predictions/predictions.service';
import { RankingsService } from '../rankings/rankings.service';

export interface GroupStandingTeam {
  teamId: number;
  teamName: string;
  flagUrl: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  teams: GroupStandingTeam[];
}

@Injectable()
export class ProdeAdminService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly teamsService: TeamsService,
    private readonly predictionsService: PredictionsService,
    private readonly rankingsService: RankingsService,
  ) {}

  async seedAll(userId?: number): Promise<any> {
    const results: any = { tournament: null, teams: [] };

    let tournament = await this.tournamentRepository.findOne({
      where: { name: 'Copa Mundial de la FIFA 2026', status: true },
    });
    if (!tournament) {
      tournament = await this.tournamentRepository.save(
        this.tournamentRepository.create({
          name: 'Copa Mundial de la FIFA 2026',
          season: '2026',
          startDate: new Date('2026-06-11'),
          endDate: new Date('2026-07-19'),
          createdBy: userId ?? null,
        }),
      );
      results.tournament = { created: true, id: tournament.id, name: tournament.name };
    } else {
      results.tournament = { created: false, id: tournament.id, name: tournament.name };
    }

    const teamsData = [
      { name: 'Argentina', code: 'ARG', country: 'Argentina', flagUrl: 'https://flagcdn.com/w80/ar.png', group: 'A' },
      { name: 'Brasil', code: 'BRA', country: 'Brasil', flagUrl: 'https://flagcdn.com/w80/br.png', group: 'A' },
      { name: 'Uruguay', code: 'URU', country: 'Uruguay', flagUrl: 'https://flagcdn.com/w80/uy.png', group: 'A' },
      { name: 'Chile', code: 'CHI', country: 'Chile', flagUrl: 'https://flagcdn.com/w80/cl.png', group: 'A' },
      { name: 'España', code: 'ESP', country: 'España', flagUrl: 'https://flagcdn.com/w80/es.png', group: 'B' },
      { name: 'Países Bajos', code: 'NED', country: 'Países Bajos', flagUrl: 'https://flagcdn.com/w80/nl.png', group: 'B' },
      { name: 'Portugal', code: 'POR', country: 'Portugal', flagUrl: 'https://flagcdn.com/w80/pt.png', group: 'B' },
      { name: 'Suiza', code: 'SUI', country: 'Suiza', flagUrl: 'https://flagcdn.com/w80/ch.png', group: 'B' },
      { name: 'Francia', code: 'FRA', country: 'Francia', flagUrl: 'https://flagcdn.com/w80/fr.png', group: 'C' },
      { name: 'Inglaterra', code: 'ENG', country: 'Inglaterra', flagUrl: 'https://flagcdn.com/w80/gb-eng.png', group: 'C' },
      { name: 'Alemania', code: 'GER', country: 'Alemania', flagUrl: 'https://flagcdn.com/w80/de.png', group: 'C' },
      { name: 'Italia', code: 'ITA', country: 'Italia', flagUrl: 'https://flagcdn.com/w80/it.png', group: 'C' },
      { name: 'México', code: 'MEX', country: 'México', flagUrl: 'https://flagcdn.com/w80/mx.png', group: 'D' },
      { name: 'Estados Unidos', code: 'USA', country: 'Estados Unidos', flagUrl: 'https://flagcdn.com/w80/us.png', group: 'D' },
      { name: 'Canadá', code: 'CAN', country: 'Canadá', flagUrl: 'https://flagcdn.com/w80/ca.png', group: 'D' },
      { name: 'Costa Rica', code: 'CRC', country: 'Costa Rica', flagUrl: 'https://flagcdn.com/w80/cr.png', group: 'D' },
      { name: 'Colombia', code: 'COL', country: 'Colombia', flagUrl: 'https://flagcdn.com/w80/co.png', group: 'E' },
      { name: 'Ecuador', code: 'ECU', country: 'Ecuador', flagUrl: 'https://flagcdn.com/w80/ec.png', group: 'E' },
      { name: 'Perú', code: 'PER', country: 'Perú', flagUrl: 'https://flagcdn.com/w80/pe.png', group: 'E' },
      { name: 'Paraguay', code: 'PAR', country: 'Paraguay', flagUrl: 'https://flagcdn.com/w80/py.png', group: 'E' },
      { name: 'Nigeria', code: 'NGA', country: 'Nigeria', flagUrl: 'https://flagcdn.com/w80/ng.png', group: 'F' },
      { name: 'Marruecos', code: 'MAR', country: 'Marruecos', flagUrl: 'https://flagcdn.com/w80/ma.png', group: 'F' },
      { name: 'Senegal', code: 'SEN', country: 'Senegal', flagUrl: 'https://flagcdn.com/w80/sn.png', group: 'F' },
      { name: 'Ghana', code: 'GHA', country: 'Ghana', flagUrl: 'https://flagcdn.com/w80/gh.png', group: 'F' },
      { name: 'Japón', code: 'JPN', country: 'Japón', flagUrl: 'https://flagcdn.com/w80/jp.png', group: 'G' },
      { name: 'Corea del Sur', code: 'KOR', country: 'Corea del Sur', flagUrl: 'https://flagcdn.com/w80/kr.png', group: 'G' },
      { name: 'Arabia Saudita', code: 'KSA', country: 'Arabia Saudita', flagUrl: 'https://flagcdn.com/w80/sa.png', group: 'G' },
      { name: 'Australia', code: 'AUS', country: 'Australia', flagUrl: 'https://flagcdn.com/w80/au.png', group: 'G' },
      { name: 'Bélgica', code: 'BEL', country: 'Bélgica', flagUrl: 'https://flagcdn.com/w80/be.png', group: 'H' },
      { name: 'Croacia', code: 'CRO', country: 'Croacia', flagUrl: 'https://flagcdn.com/w80/hr.png', group: 'H' },
      { name: 'Serbia', code: 'SRB', country: 'Serbia', flagUrl: 'https://flagcdn.com/w80/rs.png', group: 'H' },
      { name: 'Dinamarca', code: 'DEN', country: 'Dinamarca', flagUrl: 'https://flagcdn.com/w80/dk.png', group: 'H' },
      { name: 'Camerún', code: 'CMR', country: 'Camerún', flagUrl: 'https://flagcdn.com/w80/cm.png', group: 'I' },
      { name: 'Costa de Marfil', code: 'CIV', country: 'Costa de Marfil', flagUrl: 'https://flagcdn.com/w80/ci.png', group: 'I' },
      { name: 'Egipto', code: 'EGY', country: 'Egipto', flagUrl: 'https://flagcdn.com/w80/eg.png', group: 'I' },
      { name: 'Túnez', code: 'TUN', country: 'Túnez', flagUrl: 'https://flagcdn.com/w80/tn.png', group: 'I' },
      { name: 'Ucrania', code: 'UKR', country: 'Ucrania', flagUrl: 'https://flagcdn.com/w80/ua.png', group: 'J' },
      { name: 'Polonia', code: 'POL', country: 'Polonia', flagUrl: 'https://flagcdn.com/w80/pl.png', group: 'J' },
      { name: 'República Checa', code: 'CZE', country: 'República Checa', flagUrl: 'https://flagcdn.com/w80/cz.png', group: 'J' },
      { name: 'Turquía', code: 'TUR', country: 'Turquía', flagUrl: 'https://flagcdn.com/w80/tr.png', group: 'J' },
      { name: 'Suecia', code: 'SWE', country: 'Suecia', flagUrl: 'https://flagcdn.com/w80/se.png', group: 'K' },
      { name: 'Noruega', code: 'NOR', country: 'Noruega', flagUrl: 'https://flagcdn.com/w80/no.png', group: 'K' },
      { name: 'Escocia', code: 'SCO', country: 'Escocia', flagUrl: 'https://flagcdn.com/w80/gb-sct.png', group: 'K' },
      { name: 'Irlanda', code: 'IRL', country: 'Irlanda', flagUrl: 'https://flagcdn.com/w80/ie.png', group: 'K' },
      { name: 'Bolivia', code: 'BOL', country: 'Bolivia', flagUrl: 'https://flagcdn.com/w80/bo.png', group: 'L' },
      { name: 'Venezuela', code: 'VEN', country: 'Venezuela', flagUrl: 'https://flagcdn.com/w80/ve.png', group: 'L' },
      { name: 'Panamá', code: 'PAN', country: 'Panamá', flagUrl: 'https://flagcdn.com/w80/pa.png', group: 'L' },
      { name: 'Jamaica', code: 'JAM', country: 'Jamaica', flagUrl: 'https://flagcdn.com/w80/jm.png', group: 'L' },
    ];

    for (const teamData of teamsData) {
      const existing = await this.teamsService.findByCode(teamData.code);
      if (existing) {
        results.teams.push({ created: false, id: existing.id, name: teamData.name, code: teamData.code });
      } else {
        const team = await this.teamsService.create(teamData, userId);
        results.teams.push({ created: true, id: team.id, name: team.name, code: team.code });
      }
    }

    return results;
  }

  async getGroupStandings(): Promise<GroupStanding[]> {
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const standings: GroupStanding[] = [];
    for (const group of groups) {
      standings.push(await this.computeGroupStanding(group));
    }
    return standings;
  }

  async getGroupStanding(group: string): Promise<GroupStanding> {
    const validGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    if (!validGroups.includes(group)) {
      throw new NotFoundException(`Grupo ${group} no válido`);
    }
    return this.computeGroupStanding(group);
  }

  private async computeGroupStanding(group: string): Promise<GroupStanding> {
    const teams = await this.teamRepository.find({
      where: { group, status: true },
    });

    const teamStandings: GroupStandingTeam[] = await Promise.all(
      teams.map(async (team) => {
        const matches = await this.matchRepository.find({
          where: [
            { homeTeamId: team.id, stage: MatchStage.GROUP_STAGE, status: true },
            { awayTeamId: team.id, stage: MatchStage.GROUP_STAGE, status: true },
          ],
        });

        let won = 0;
        let drawn = 0;
        let lost = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;

        for (const match of matches) {
          if (match.homeScore === null || match.awayScore === null) continue;

          if (match.homeTeamId === team.id) {
            goalsFor += match.homeScore;
            goalsAgainst += match.awayScore;
            if (match.homeScore > match.awayScore) won++;
            else if (match.homeScore === match.awayScore) drawn++;
            else lost++;
          } else {
            goalsFor += match.awayScore;
            goalsAgainst += match.homeScore;
            if (match.awayScore > match.homeScore) won++;
            else if (match.awayScore === match.homeScore) drawn++;
            else lost++;
          }
        }

        const played = won + drawn + lost;
        const goalDifference = goalsFor - goalsAgainst;
        const points = won * 3 + drawn;

        return {
          teamId: team.id,
          teamName: team.name,
          flagUrl: team.flagUrl,
          played,
          won,
          drawn,
          lost,
          goalsFor,
          goalsAgainst,
          goalDifference,
          points,
        };
      }),
    );

    teamStandings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    return { group, teams: teamStandings };
  }

  async createBulkMatches(matchesInput: any[], userId?: number): Promise<any> {
    const tournament = await this.tournamentRepository.findOne({
      where: { name: 'Copa Mundial de la FIFA 2026', status: true },
    });
    if (!tournament) {
      throw new NotFoundException('Torneo no encontrado. Ejecute el seed primero.');
    }

    const created: any[] = [];

    for (const input of matchesInput) {
      const matchData: any = {
        tournamentId: tournament.id,
        homeTeamId: input.homeTeamId,
        awayTeamId: input.awayTeamId,
        matchDate: new Date(input.matchDate),
        stage: input.stage,
        matchday: input.matchday ?? null,
        createdBy: userId ?? null,
      };

      if (input.homeScore != null && input.awayScore != null) {
        matchData.homeScore = input.homeScore;
        matchData.awayScore = input.awayScore;
        matchData.matchStatus = MatchStatus.FINISHED;
      }

      const match = this.matchRepository.create(matchData as any) as any;
      const saved: any = await this.matchRepository.save(match);

      if (saved.matchStatus === MatchStatus.FINISHED) {
        const scored = await this.predictionsService.scoreAllPredictionsForMatch(saved.id);
        if (scored > 0) {
          const predictions = await this.predictionsService.findByMatch(saved.id);
          const userIds = [...new Set(predictions.filter(p => p.isScored).map(p => p.userId))];
          for (const uid of userIds) {
            await this.rankingsService.updateUserStats(uid);
          }
        }
      }

      created.push({
        id: saved.id,
        homeTeamId: saved.homeTeamId,
        awayTeamId: saved.awayTeamId,
        matchDate: saved.matchDate,
        stage: saved.stage,
        matchStatus: saved.matchStatus,
        homeScore: saved.homeScore,
        awayScore: saved.awayScore,
      });
    }

    return { created: created.length, matches: created };
  }

  getKnockoutTemplate() {
    return [
      { key: 1, name: 'Llave 1', home: '2° Grupo A', away: '2° Grupo B', stage: 'round_of_32', defaultDate: '2026-06-28T13:00:00' },
      { key: 2, name: 'Llave 2', home: '1° Grupo C', away: '2° Grupo F', stage: 'round_of_32', defaultDate: '2026-06-29T11:00:00' },
      { key: 3, name: 'Llave 3', home: '1° Grupo E', away: 'Mejor 3° (A,B,C,D,F)', stage: 'round_of_32', defaultDate: '2026-06-29T14:30:00' },
      { key: 4, name: 'Llave 4', home: '1° Grupo F', away: '2° Grupo C', stage: 'round_of_32', defaultDate: '2026-06-29T19:00:00' },
      { key: 5, name: 'Llave 5', home: '2° Grupo E', away: '2° Grupo I', stage: 'round_of_32', defaultDate: '2026-06-30T11:00:00' },
      { key: 6, name: 'Llave 6', home: '1° Grupo I', away: 'Mejor 3° (C,D,F,G,H)', stage: 'round_of_32', defaultDate: '2026-06-30T15:00:00' },
      { key: 7, name: 'Llave 7', home: '1° Grupo A', away: 'Mejor 3° (C,E,F,H,I)', stage: 'round_of_32', defaultDate: '2026-06-30T19:00:00' },
      { key: 8, name: 'Llave 8', home: '1° Grupo L', away: 'Mejor 3° (E,H,I,J,K)', stage: 'round_of_32', defaultDate: '2026-07-01T10:00:00' },
      { key: 9, name: 'Llave 9', home: '1° Grupo G', away: 'Mejor 3° (A,E,H,I,J)', stage: 'round_of_32', defaultDate: '2026-07-01T14:00:00' },
      { key: 10, name: 'Llave 10', home: '1° Grupo D', away: 'Mejor 3° (B,E,F,I,J)', stage: 'round_of_32', defaultDate: '2026-07-01T18:00:00' },
      { key: 11, name: 'Llave 11', home: '1° Grupo H', away: '2° Grupo J', stage: 'round_of_32', defaultDate: '2026-07-02T13:00:00' },
      { key: 12, name: 'Llave 12', home: '2° Grupo K', away: '2° Grupo L', stage: 'round_of_32', defaultDate: '2026-07-02T17:00:00' },
      { key: 13, name: 'Llave 13', home: '1° Grupo B', away: 'Mejor 3° (E,F,G,I,J)', stage: 'round_of_32', defaultDate: '2026-07-02T21:00:00' },
      { key: 14, name: 'Llave 14', home: '2° Grupo D', away: '2° Grupo G', stage: 'round_of_32', defaultDate: '2026-07-03T12:00:00' },
      { key: 15, name: 'Llave 15', home: '1° Grupo J', away: '2° Grupo H', stage: 'round_of_32', defaultDate: '2026-07-03T16:00:00' },
      { key: 16, name: 'Llave 16', home: '1° Grupo K', away: 'Mejor 3° (D,E,I,J,L)', stage: 'round_of_32', defaultDate: '2026-07-03T19:30:00' },
    ];
  }
}

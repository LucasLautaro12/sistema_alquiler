import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Team } from '../../teams/entities/team.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PLAY = 'in_play',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
}

export enum MatchStage {
  GROUP_STAGE = 'group_stage',
  ROUND_OF_32 = 'round_of_32',
  ROUND_OF_16 = 'round_of_16',
  QUARTERFINALS = 'quarterfinals',
  SEMIFINALS = 'semifinals',
  THIRD_PLACE = 'third_place',
  FINAL = 'final',
}

@Entity('matches')
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ type: 'int', name: 'tournament_id' })
  tournamentId: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: Team;

  @Column({ type: 'int', name: 'home_team_id' })
  homeTeamId: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: Team;

  @Column({ type: 'int', name: 'away_team_id' })
  awayTeamId: number;

  @Column({ type: 'timestamp', name: 'match_date' })
  @Index()
  matchDate: Date;

  @Column({ type: 'varchar', length: 20, name: 'match_status', default: MatchStatus.SCHEDULED })
  matchStatus: MatchStatus;

  @Column({ type: 'varchar', length: 30 })
  @Index()
  stage: MatchStage;

  @Column({ type: 'int', nullable: true, name: 'home_score' })
  homeScore: number | null;

  @Column({ type: 'int', nullable: true, name: 'away_score' })
  awayScore: number | null;

  @Column({ type: 'int', nullable: true, name: 'external_id' })
  externalId: number | null;

  @Column({ type: 'int', name: 'matchday', nullable: true })
  matchday: number | null;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdeAdminController } from './prode-admin.controller';
import { ProdeAdminService } from './prode-admin.service';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match } from '../matches/entities/match.entity';
import { TeamsModule } from '../teams/teams.module';
import { TournamentsModule } from '../tournaments/tournaments.module';
import { MatchesModule } from '../matches/matches.module';
import { PredictionsModule } from '../predictions/predictions.module';
import { RankingsModule } from '../rankings/rankings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Tournament, Match]),
    TeamsModule,
    TournamentsModule,
    MatchesModule,
    PredictionsModule,
    RankingsModule,
  ],
  controllers: [ProdeAdminController],
  providers: [ProdeAdminService],
})
export class ProdeAdminModule {}

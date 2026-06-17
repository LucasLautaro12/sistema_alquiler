import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { Match } from '../matches/entities/match.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Team, Tournament, Match]),
  ],
  providers: [SyncService],
})
export class SyncModule {}

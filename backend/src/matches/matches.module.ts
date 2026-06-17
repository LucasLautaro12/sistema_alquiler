import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entities/match.entity';
import { PredictionsModule } from '../predictions/predictions.module';
import { RankingsModule } from '../rankings/rankings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    PredictionsModule,
    RankingsModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}

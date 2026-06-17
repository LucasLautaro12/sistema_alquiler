import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Match, MatchStatus } from './entities/match.entity';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UpdateMatchResultDto } from './dtos/update-match-result.dto';
import { PredictionsService } from '../predictions/predictions.service';
import { RankingsService } from '../rankings/rankings.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly predictionsService: PredictionsService,
    private readonly rankingsService: RankingsService,
  ) {}

  async findAll(filter?: { matchStatus?: string; stage?: string; tournamentId?: number }): Promise<Match[]> {
    const where: FindOptionsWhere<Match> = { status: true };
    if (filter?.matchStatus) where.matchStatus = filter.matchStatus as MatchStatus;
    if (filter?.stage) where.stage = filter.stage as any;
    if (filter?.tournamentId) where.tournamentId = filter.tournamentId;
    return this.matchRepository.find({
      where,
      relations: ['homeTeam', 'awayTeam', 'tournament'],
      order: { matchDate: 'ASC' },
    });
  }

  async findById(id: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id, status: true },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
    });
    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }
    return match;
  }

  async findUpcoming(): Promise<Match[]> {
    return this.matchRepository.find({
      where: { status: true, matchStatus: MatchStatus.SCHEDULED },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
      order: { matchDate: 'ASC' },
    });
  }

  async findFinished(): Promise<Match[]> {
    return this.matchRepository.find({
      where: { status: true, matchStatus: MatchStatus.FINISHED },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
      order: { matchDate: 'DESC' },
    });
  }

  async findByTournament(tournamentId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { tournamentId, status: true },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
      order: { matchDate: 'ASC' },
    });
  }

  async create(dto: CreateMatchDto, createdBy?: number): Promise<Match> {
    const match = this.matchRepository.create({
      tournamentId: dto.tournamentId,
      homeTeamId: dto.homeTeamId,
      awayTeamId: dto.awayTeamId,
      matchDate: new Date(dto.matchDate),
      stage: dto.stage as any,
      matchday: dto.matchday ?? null,
      createdBy: createdBy ?? null,
    });
    return this.matchRepository.save(match);
  }

  async update(id: number, data: Partial<Match>, updatedBy?: number): Promise<Match> {
    const match = await this.findById(id);
    Object.assign(match, data, { updatedBy: updatedBy ?? null });
    return this.matchRepository.save(match);
  }

  async updateResult(id: number, dto: UpdateMatchResultDto, updatedBy?: number): Promise<Match> {
    const match = await this.findById(id);
    match.homeScore = dto.homeScore;
    match.awayScore = dto.awayScore;
    match.matchStatus = MatchStatus.FINISHED;
    match.updatedBy = updatedBy ?? null;
    await this.matchRepository.save(match);

    const scored = await this.predictionsService.scoreAllPredictionsForMatch(id);
    if (scored > 0) {
      const predictions = await this.predictionsService.findByMatch(id);
      const userIds = [...new Set(predictions.filter(p => p.isScored).map(p => p.userId))];
      for (const userId of userIds) {
        await this.rankingsService.updateUserStats(userId);
      }
    }

    return this.findById(id);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const match = await this.findById(id);
    await this.matchRepository.save({
      ...match,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

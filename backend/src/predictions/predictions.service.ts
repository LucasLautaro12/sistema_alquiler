import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './entities/prediction.entity';
import { Match, MatchStatus } from '../matches/entities/match.entity';
import { CreatePredictionDto } from './dtos/create-prediction.dto';
import { UpdatePredictionDto } from './dtos/update-prediction.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async findByUser(userId: number): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { userId, status: true },
      relations: ['match', 'match.homeTeam', 'match.awayTeam', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMatch(matchId: number): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { matchId, status: true },
      relations: ['user', 'match', 'match.homeTeam', 'match.awayTeam'],
    });
  }

  async findOne(userId: number, matchId: number): Promise<Prediction | null> {
    return this.predictionRepository.findOne({
      where: { userId, matchId, status: true },
      relations: ['match', 'match.homeTeam', 'match.awayTeam', 'user'],
    });
  }

  async create(userId: number, dto: CreatePredictionDto): Promise<Prediction> {
    const match = await this.matchRepository.findOne({
      where: { id: dto.matchId, status: true },
    });
    if (!match) {
      throw new NotFoundException(`Partido con ID ${dto.matchId} no encontrado`);
    }
    if (match.matchStatus !== MatchStatus.SCHEDULED) {
      throw new ConflictException('No se puede pronosticar un partido ya iniciado o finalizado');
    }
    const existing = await this.findOne(userId, dto.matchId);
    if (existing) {
      throw new ConflictException('Ya existe un pronóstico para este partido');
    }
    const prediction = this.predictionRepository.create({
      userId,
      matchId: dto.matchId,
      homeScore: dto.homeScore,
      awayScore: dto.awayScore,
      createdBy: userId,
    });
    return this.predictionRepository.save(prediction);
  }

  async update(userId: number, id: number, dto: UpdatePredictionDto): Promise<Prediction> {
    const prediction = await this.predictionRepository.findOne({
      where: { id, status: true },
      relations: ['match'],
    });
    if (!prediction) {
      throw new NotFoundException(`Pronóstico con ID ${id} no encontrado`);
    }
    if (prediction.userId !== userId) {
      throw new ForbiddenException('No puedes modificar un pronóstico de otro usuario');
    }
    if (prediction.match.matchStatus !== MatchStatus.SCHEDULED) {
      throw new ConflictException('No se puede modificar un pronóstico de un partido ya iniciado o finalizado');
    }
    if (dto.homeScore !== undefined) prediction.homeScore = dto.homeScore;
    if (dto.awayScore !== undefined) prediction.awayScore = dto.awayScore;
    prediction.updatedBy = userId;
    return this.predictionRepository.save(prediction);
  }

  async softDelete(userId: number, id: number): Promise<void> {
    const prediction = await this.predictionRepository.findOne({
      where: { id, status: true },
    });
    if (!prediction) {
      throw new NotFoundException(`Pronóstico con ID ${id} no encontrado`);
    }
    if (prediction.userId !== userId) {
      throw new ForbiddenException('No puedes eliminar un pronóstico de otro usuario');
    }
    await this.predictionRepository.save({
      ...prediction,
      status: false,
      deletedAt: new Date(),
      deletedBy: userId,
    });
  }

  async scorePrediction(predictionId: number, matchHomeScore: number, matchAwayScore: number): Promise<Prediction> {
    const prediction = await this.predictionRepository.findOne({
      where: { id: predictionId, status: true },
    });
    if (!prediction) {
      throw new NotFoundException(`Pronóstico con ID ${predictionId} no encontrado`);
    }
    if (prediction.isScored) {
      return prediction;
    }
    const isExact = prediction.homeScore === matchHomeScore && prediction.awayScore === matchAwayScore;
    let isCorrectOutcome = false;
    if (!isExact) {
      const predDiff = prediction.homeScore - prediction.awayScore;
      const matchDiff = matchHomeScore - matchAwayScore;
      isCorrectOutcome = (predDiff > 0 && matchDiff > 0) || (predDiff < 0 && matchDiff < 0) || (predDiff === 0 && matchDiff === 0);
    }
    let points = 0;
    if (isExact) {
      points = 6;
      isCorrectOutcome = true;
    } else if (isCorrectOutcome) {
      points = 3;
    }
    prediction.points = points;
    prediction.isExact = isExact;
    prediction.isCorrectOutcome = isCorrectOutcome;
    prediction.isScored = true;
    return this.predictionRepository.save(prediction);
  }

  async scoreAllPredictionsForMatch(matchId: number): Promise<number> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId, status: true },
    });
    if (!match || match.matchStatus !== MatchStatus.FINISHED || match.homeScore === null || match.awayScore === null) {
      return 0;
    }
    const predictions = await this.predictionRepository.find({
      where: { matchId, status: true, isScored: false },
    });
    for (const prediction of predictions) {
      await this.scorePrediction(prediction.id, match.homeScore, match.awayScore);
    }
    return predictions.length;
  }

  async getScoringStats(userId: number): Promise<{ total: number; exact: number; correctOutcome: number; points: number }> {
    const predictions = await this.predictionRepository.find({
      where: { userId, status: true, isScored: true },
    });
    return {
      total: predictions.length,
      exact: predictions.filter(p => p.isExact).length,
      correctOutcome: predictions.filter(p => p.isCorrectOutcome).length,
      points: predictions.reduce((sum, p) => sum + p.points, 0),
    };
  }
}

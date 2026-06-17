import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface RankingEntry {
  position: number;
  id: number;
  username: string;
  name: string;
  totalPoints: number;
  exactPredictions: number;
  correctOutcomes: number;
  totalPredictions: number;
}

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async getGlobalRanking(): Promise<RankingEntry[]> {
    const users = await this.userRepository.find({
      where: { status: true },
      order: { totalPoints: 'DESC', exactPredictions: 'DESC', correctOutcomes: 'DESC' },
    });
    return users.map((user, index) => ({
      position: index + 1,
      id: user.id,
      username: user.name,
      name: user.name,
      totalPoints: user.totalPoints,
      exactPredictions: user.exactPredictions,
      correctOutcomes: user.correctOutcomes,
      totalPredictions: user.totalPredictions,
    }));
  }

  async getTopUsers(limit: number = 3): Promise<RankingEntry[]> {
    const users = await this.userRepository.find({
      where: { status: true },
      order: { totalPoints: 'DESC', exactPredictions: 'DESC', correctOutcomes: 'DESC' },
      take: limit,
    });
    return users.map((user, index) => ({
      position: index + 1,
      id: user.id,
      username: user.name,
      name: user.name,
      totalPoints: user.totalPoints,
      exactPredictions: user.exactPredictions,
      correctOutcomes: user.correctOutcomes,
      totalPredictions: user.totalPredictions,
    }));
  }

  async getUserPosition(userId: number): Promise<RankingEntry | null> {
    const ranking = await this.getGlobalRanking();
    return ranking.find(entry => entry.id === userId) ?? null;
  }

  async updateUserStats(userId: number): Promise<void> {
    await this.usersService.updateStats(userId);
  }
}

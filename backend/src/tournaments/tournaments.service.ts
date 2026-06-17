import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async findAll(): Promise<Tournament[]> {
    return this.tournamentRepository.find({
      where: { status: true },
      order: { startDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, status: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Torneo con ID ${id} no encontrado`);
    }
    return tournament;
  }

  async create(data: Partial<Tournament>, createdBy?: number): Promise<Tournament> {
    const tournament = this.tournamentRepository.create({ ...data, createdBy: createdBy ?? null });
    return this.tournamentRepository.save(tournament);
  }

  async update(id: number, data: Partial<Tournament>, updatedBy?: number): Promise<Tournament> {
    const tournament = await this.findById(id);
    Object.assign(tournament, data, { updatedBy: updatedBy ?? null });
    return this.tournamentRepository.save(tournament);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const tournament = await this.findById(id);
    await this.tournamentRepository.save({
      ...tournament,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

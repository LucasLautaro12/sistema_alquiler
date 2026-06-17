import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      where: { status: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, status: true },
    });
    if (!team) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return team;
  }

  async findByCode(code: string): Promise<Team | null> {
    return this.teamRepository.findOne({ where: { code, status: true } });
  }

  async create(data: Partial<Team>, createdBy?: number): Promise<Team> {
    const team = this.teamRepository.create({ ...data, createdBy: createdBy ?? null });
    return this.teamRepository.save(team);
  }

  async update(id: number, data: Partial<Team>, updatedBy?: number): Promise<Team> {
    const team = await this.findById(id);
    Object.assign(team, data, { updatedBy: updatedBy ?? null });
    return this.teamRepository.save(team);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const team = await this.findById(id);
    await this.teamRepository.save({
      ...team,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

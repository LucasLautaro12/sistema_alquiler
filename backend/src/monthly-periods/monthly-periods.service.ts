import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyPeriod } from './entities/monthly-period.entity';
import { CreateMonthlyPeriodDto } from './dtos/create-monthly-period.dto';

@Injectable()
export class MonthlyPeriodsService {
  constructor(
    @InjectRepository(MonthlyPeriod)
    private readonly periodRepository: Repository<MonthlyPeriod>,
  ) {}

  async findAll(): Promise<MonthlyPeriod[]> {
    return this.periodRepository.find({
      where: { status: true },
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findById(id: number): Promise<MonthlyPeriod> {
    const period = await this.periodRepository.findOne({
      where: { id, status: true },
    });
    if (!period) {
      throw new NotFoundException(`Período con ID ${id} no encontrado`);
    }
    return period;
  }

  async findByYearMonth(year: number, month: number): Promise<MonthlyPeriod | null> {
    return this.periodRepository.findOne({
      where: { year, month, status: true },
    });
  }

  async create(dto: CreateMonthlyPeriodDto, createdBy?: number): Promise<MonthlyPeriod> {
    const existing = await this.periodRepository.findOne({
      where: { year: dto.year, month: dto.month },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un período para ${dto.month}/${dto.year}`,
      );
    }

    const period = this.periodRepository.create({
      year: dto.year,
      month: dto.month,
      createdBy: createdBy ?? null,
    });

    return this.periodRepository.save(period);
  }

  async close(id: number, updatedBy?: number): Promise<MonthlyPeriod> {
    const period = await this.findById(id);
    period.isClosed = true;
    period.updatedBy = updatedBy ?? null;
    return this.periodRepository.save(period);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const period = await this.findById(id);
    await this.periodRepository.save({
      ...period,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

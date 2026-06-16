import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashContribution } from './entities/cash-contribution.entity';
import { CreateCashContributionDto } from './dtos/create-cash-contribution.dto';
import { MonthlyPeriodsService } from '../monthly-periods/monthly-periods.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CashContributionsService {
  constructor(
    @InjectRepository(CashContribution)
    private readonly contributionRepository: Repository<CashContribution>,
    private readonly periodsService: MonthlyPeriodsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<CashContribution[]> {
    return this.contributionRepository.find({
      where: { status: true },
      relations: ['monthlyPeriod', 'user'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<CashContribution> {
    const contribution = await this.contributionRepository.findOne({
      where: { id, status: true },
      relations: ['monthlyPeriod', 'user'],
    });
    if (!contribution) {
      throw new NotFoundException(`Contribución con ID ${id} no encontrada`);
    }
    return contribution;
  }

  async findByPeriod(periodId: number): Promise<CashContribution[]> {
    return this.contributionRepository.find({
      where: { monthlyPeriod: { id: periodId }, status: true },
      relations: ['user'],
    });
  }

  async findByUser(userId: number): Promise<CashContribution[]> {
    return this.contributionRepository.find({
      where: { user: { id: userId }, status: true },
      relations: ['monthlyPeriod'],
      order: { paymentDate: 'DESC' },
    });
  }

  async create(
    dto: CreateCashContributionDto,
    createdBy?: number,
  ): Promise<CashContribution> {
    const period = await this.periodsService.findById(dto.monthlyPeriodId);
    const user = await this.usersService.findById(dto.userId);

    const contribution = this.contributionRepository.create({
      monthlyPeriod: period,
      user,
      amount: dto.amount,
      paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      notes: dto.notes ?? null,
      createdBy: createdBy ?? null,
    });

    return this.contributionRepository.save(contribution);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const contribution = await this.findById(id);
    await this.contributionRepository.save({
      ...contribution,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyExpense } from './entities/monthly-expense.entity';
import { CreateMonthlyExpenseDto } from './dtos/create-monthly-expense.dto';
import { UpdateMonthlyExpenseDto } from './dtos/update-monthly-expense.dto';
import { MonthlyPeriodsService } from '../monthly-periods/monthly-periods.service';
import { ExpenseCategoriesService } from '../expense-categories/expense-categories.service';

@Injectable()
export class MonthlyExpensesService {
  constructor(
    @InjectRepository(MonthlyExpense)
    private readonly expenseRepository: Repository<MonthlyExpense>,
    private readonly periodsService: MonthlyPeriodsService,
    private readonly categoriesService: ExpenseCategoriesService,
  ) {}

  async findAll(): Promise<MonthlyExpense[]> {
    return this.expenseRepository.find({
      where: { status: true },
      relations: ['monthlyPeriod', 'expenseCategory'],
      order: { monthlyPeriod: { year: 'DESC', month: 'DESC' } },
    });
  }

  async findById(id: number): Promise<MonthlyExpense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, status: true },
      relations: ['monthlyPeriod', 'expenseCategory'],
    });
    if (!expense) {
      throw new NotFoundException(`Gasto mensual con ID ${id} no encontrado`);
    }
    return expense;
  }

  async findByPeriod(periodId: number): Promise<MonthlyExpense[]> {
    return this.expenseRepository.find({
      where: { monthlyPeriod: { id: periodId }, status: true },
      relations: ['expenseCategory'],
    });
  }

  async create(dto: CreateMonthlyExpenseDto, createdBy?: number): Promise<MonthlyExpense> {
    const period = await this.periodsService.findById(dto.monthlyPeriodId);
    const category = await this.categoriesService.findById(dto.expenseCategoryId);

    const existing = await this.expenseRepository.findOne({
      where: {
        monthlyPeriod: { id: period.id },
        expenseCategory: { id: category.id },
      },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe un gasto para esta categoría en el período indicado`,
      );
    }

    const expense = this.expenseRepository.create({
      monthlyPeriod: period,
      expenseCategory: category,
      amount: dto.amount,
      createdBy: createdBy ?? null,
    });

    return this.expenseRepository.save(expense);
  }

  async update(
    id: number,
    dto: UpdateMonthlyExpenseDto,
    updatedBy?: number,
  ): Promise<MonthlyExpense> {
    const expense = await this.findById(id);
    Object.assign(expense, { ...dto, updatedBy: updatedBy ?? null });
    return this.expenseRepository.save(expense);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const expense = await this.findById(id);
    await this.expenseRepository.save({
      ...expense,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

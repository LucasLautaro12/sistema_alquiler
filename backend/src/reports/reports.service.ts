import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthlyExpense } from '../monthly-expenses/entities/monthly-expense.entity';
import { ExpensePayment } from '../expense-payments/entities/expense-payment.entity';
import { ExpenseCategory } from '../expense-categories/entities/expense-category.entity';
import { User } from '../users/entities/user.entity';
import { MonthlyPeriod } from '../monthly-periods/entities/monthly-period.entity';
import {
  MonthlySummaryDto,
  UserSummaryDto,
  CategoryDetailDto,
  CategoryHistoryDto,
  UserPaymentHistoryDto,
  ComparisonDto,
  TrendDto,
} from './dtos/monthly-summary.dto';

const MESES_NOMBRES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(MonthlyExpense)
    private readonly expenseRepository: Repository<MonthlyExpense>,
    @InjectRepository(ExpensePayment)
    private readonly paymentRepository: Repository<ExpensePayment>,
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MonthlyPeriod)
    private readonly periodRepository: Repository<MonthlyPeriod>,
  ) {}

  async getMonthlySummary(periodId: number): Promise<MonthlySummaryDto> {
    const period = await this.periodRepository.findOne({
      where: { id: periodId, status: true },
    });
    if (!period) throw new Error('Período no encontrado');

    const expenses = await this.expenseRepository.find({
      where: { monthlyPeriod: { id: periodId }, status: true },
      relations: ['expenseCategory'],
    });

    const users = await this.userRepository.find({
      where: { status: true },
    });
    const activeUsers = users.length;
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const sharePerUser = activeUsers > 0 ? totalExpenses / activeUsers : 0;

    const rentExpense = expenses.find((e) => e.expenseCategory.isCashPayment);
    const rentAmount = rentExpense ? Number(rentExpense.amount) : 0;

    const payments = await this.paymentRepository.find({
      where: { monthlyPeriod: { id: periodId }, status: true },
      relations: ['expenseCategory', 'user'],
    });

    const paidByUser: Record<number, number> = {};
    for (const u of users) paidByUser[u.id] = 0;
    for (const p of payments) {
      paidByUser[p.user.id] = (paidByUser[p.user.id] ?? 0) + Number(p.amount);
    }

    const categoryDetails: CategoryDetailDto[] = expenses.map((e) => ({
      categoryName: e.expenseCategory.name,
      amount: Number(e.amount),
    }));

    const userSummaries: UserSummaryDto[] = users.map((u) => ({
      userId: u.id,
      userName: u.name,
      sharePerUser: Math.round(sharePerUser * 100) / 100,
      amountAlreadyPaid: paidByUser[u.id] ?? 0,
      cashToPay: Math.max(0, Math.round((sharePerUser - (paidByUser[u.id] ?? 0)) * 100) / 100),
    }));

    return {
      periodId: period.id,
      month: period.month,
      year: period.year,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      activeUsers,
      sharePerUser: Math.round(sharePerUser * 100) / 100,
      rentAmount,
      categoryDetails,
      userSummaries,
    };
  }

  async getCategoryHistory(
    categoryId?: number,
  ): Promise<CategoryHistoryDto[]> {
    const categories = categoryId
      ? [await this.categoryRepository.findOneOrFail({ where: { id: categoryId } })]
      : await this.categoryRepository.find({ where: { status: true } });

    const result: CategoryHistoryDto[] = [];

    for (const cat of categories) {
      const expenses = await this.expenseRepository.find({
        where: { expenseCategory: { id: cat.id }, status: true },
        relations: ['monthlyPeriod'],
        order: { monthlyPeriod: { year: 'ASC', month: 'ASC' } },
      });

      result.push({
        categoryName: cat.name,
        categoryCode: cat.code,
        history: expenses.map((e) => ({
          period: `${MESES_NOMBRES[e.monthlyPeriod.month]} ${e.monthlyPeriod.year}`,
          amount: Number(e.amount),
        })),
      });
    }

    return result;
  }

  async getUserPaymentHistory(userId?: number): Promise<UserPaymentHistoryDto[]> {
    const users = userId
      ? [await this.userRepository.findOneOrFail({ where: { id: userId } })]
      : await this.userRepository.find({ where: { status: true } });

    const result: UserPaymentHistoryDto[] = [];

    for (const user of users) {
      const payments = await this.paymentRepository.find({
        where: { user: { id: user.id }, status: true },
        relations: ['monthlyPeriod', 'expenseCategory'],
        order: { paymentDate: 'ASC' },
      });

      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      result.push({
        userId: user.id,
        userName: user.name,
        payments: payments.map((p) => ({
          period: `${MESES_NOMBRES[p.monthlyPeriod.month]} ${p.monthlyPeriod.year}`,
          category: p.expenseCategory.name,
          amount: Number(p.amount),
          paymentDate: p.paymentDate.toISOString(),
        })),
        totalPaid,
      });
    }

    return result;
  }

  async getMonthlyComparison(
    currentPeriodId: number,
    previousPeriodId: number,
  ): Promise<ComparisonDto> {
    const [current, previous] = await Promise.all([
      this.getMonthlySummary(currentPeriodId),
      this.getMonthlySummary(previousPeriodId),
    ]);

    const percentageChange =
      previous.totalExpenses > 0
        ? Math.round(
            ((current.totalExpenses - previous.totalExpenses) /
              previous.totalExpenses) *
              100 *
              100,
          ) / 100
        : 0;

    return { currentPeriod: current, previousPeriod: previous, percentageChange };
  }

  async getTrends(): Promise<TrendDto> {
    const expenses = await this.expenseRepository.find({
      where: { status: true },
      relations: ['monthlyPeriod', 'expenseCategory'],
      order: { monthlyPeriod: { year: 'ASC', month: 'ASC' } },
    });

    const grouped: Record<
      string,
      { total: number; byCategory: Record<string, number> }
    > = {};

    for (const e of expenses) {
      const key = `${e.monthlyPeriod.year}-${String(e.monthlyPeriod.month).padStart(2, '0')}`;
      const label = `${MESES_NOMBRES[e.monthlyPeriod.month]} ${e.monthlyPeriod.year}`;

      if (!grouped[label]) {
        grouped[label] = { total: 0, byCategory: {} };
      }

      const amount = Number(e.amount);
      grouped[label].total += amount;
      const code = e.expenseCategory.code.toLowerCase();
      grouped[label].byCategory[code] =
        (grouped[label].byCategory[code] ?? 0) + amount;
    }

    return {
      data: Object.entries(grouped).map(([period, data]) => ({
        period,
        totalExpenses: Math.round(data.total * 100) / 100,
        rent: data.byCategory['rent'] ?? 0,
        gas: data.byCategory['gas'] ?? 0,
        waterElectricity: data.byCategory['water_electricity'] ?? 0,
        limsa: data.byCategory['limsa'] ?? 0,
        buildingFees: data.byCategory['building_fees'] ?? 0,
      })),
    };
  }
}

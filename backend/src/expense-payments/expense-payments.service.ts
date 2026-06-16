import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpensePayment } from './entities/expense-payment.entity';
import { CreateExpensePaymentDto } from './dtos/create-expense-payment.dto';
import { MonthlyPeriodsService } from '../monthly-periods/monthly-periods.service';
import { ExpenseCategoriesService } from '../expense-categories/expense-categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpensePaymentsService {
  constructor(
    @InjectRepository(ExpensePayment)
    private readonly paymentRepository: Repository<ExpensePayment>,
    private readonly periodsService: MonthlyPeriodsService,
    private readonly categoriesService: ExpenseCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<ExpensePayment[]> {
    return this.paymentRepository.find({
      where: { status: true },
      relations: ['monthlyPeriod', 'expenseCategory', 'user'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<ExpensePayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id, status: true },
      relations: ['monthlyPeriod', 'expenseCategory', 'user'],
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return payment;
  }

  async findByPeriod(periodId: number): Promise<ExpensePayment[]> {
    return this.paymentRepository.find({
      where: { monthlyPeriod: { id: periodId }, status: true },
      relations: ['expenseCategory', 'user'],
    });
  }

  async findByUser(userId: number): Promise<ExpensePayment[]> {
    return this.paymentRepository.find({
      where: { user: { id: userId }, status: true },
      relations: ['monthlyPeriod', 'expenseCategory'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<ExpensePayment[]> {
    return this.paymentRepository.find({
      where: { expenseCategory: { id: categoryId }, status: true },
      relations: ['monthlyPeriod', 'user'],
      order: { paymentDate: 'DESC' },
    });
  }

  async create(dto: CreateExpensePaymentDto, createdBy?: number): Promise<ExpensePayment> {
    const period = await this.periodsService.findById(dto.monthlyPeriodId);
    const category = await this.categoriesService.findById(dto.expenseCategoryId);
    const user = await this.usersService.findById(dto.userId);

    const payment = this.paymentRepository.create({
      monthlyPeriod: period,
      expenseCategory: category,
      user,
      amount: dto.amount,
      paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      notes: dto.notes ?? null,
      createdBy: createdBy ?? null,
    });

    return this.paymentRepository.save(payment);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const payment = await this.findById(id);
    await this.paymentRepository.save({
      ...payment,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }
}

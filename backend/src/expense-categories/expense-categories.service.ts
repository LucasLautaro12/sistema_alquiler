import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseCategory } from './entities/expense-category.entity';

@Injectable()
export class ExpenseCategoriesService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly categoryRepository: Repository<ExpenseCategory>,
  ) {}

  async findAll(): Promise<ExpenseCategory[]> {
    return this.categoryRepository.find({
      where: { status: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<ExpenseCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id, status: true },
    });
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  async findByCode(code: string): Promise<ExpenseCategory | null> {
    return this.categoryRepository.findOne({
      where: { code, status: true },
    });
  }

  async findCashCategory(): Promise<ExpenseCategory> {
    const category = await this.categoryRepository.findOne({
      where: { isCashPayment: true, status: true },
    });
    if (!category) {
      throw new NotFoundException('Categoría de pago en efectivo no encontrada');
    }
    return category;
  }

  async findNonCashCategories(): Promise<ExpenseCategory[]> {
    return this.categoryRepository.find({
      where: { isCashPayment: false, status: true },
    });
  }
}

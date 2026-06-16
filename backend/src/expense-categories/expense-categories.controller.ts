import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExpenseCategoriesService } from './expense-categories.service';
import { ExpenseCategoryResponseDto } from './dtos/expense-category-response.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Categorías de Gastos')
@Public()
@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(
    private readonly categoriesService: ExpenseCategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías de gastos' })
  async findAll(): Promise<ExpenseCategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll();
    return ExpenseCategoryResponseDto.fromEntities(categories);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExpenseCategoryResponseDto> {
    const category = await this.categoriesService.findById(id);
    return ExpenseCategoryResponseDto.fromEntity(category);
  }
}

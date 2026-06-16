import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from './entities/user.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios activos' })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return UserResponseDto.fromEntities(users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return UserResponseDto.fromEntity(user);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user?: User,
  ): Promise<UserResponseDto> {
    const created = await this.usersService.create(dto, user?.id);
    return UserResponseDto.fromEntity(created);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user?: User,
  ): Promise<UserResponseDto> {
    const updated = await this.usersService.update(id, dto, user?.id);
    return UserResponseDto.fromEntity(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: User,
  ): Promise<void> {
    return this.usersService.softDelete(id, user?.id);
  }
}

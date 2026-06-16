import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, status: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByDni(dni: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { dni, status: true } });
  }

  async create(dto: CreateUserDto, createdBy?: number): Promise<User> {
    const existingDni = await this.userRepository.findOne({
      where: { dni: dto.dni },
    });
    if (existingDni) {
      throw new ConflictException(`El DNI ${dto.dni} ya está registrado`);
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException(`El email ${dto.email} ya está registrado`);
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = this.userRepository.create({
      dni: dto.dni,
      name: dto.name,
      email: dto.email,
      password: hash,
      createdBy: createdBy ?? null,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto, updatedBy?: number): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new ConflictException(`El email ${dto.email} ya está registrado`);
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    Object.assign(user, dto, { updatedBy: updatedBy ?? null });
    return this.userRepository.save(user);
  }

  async softDelete(id: number, deletedBy?: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.save({
      ...user,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy ?? null,
    });
  }

  async countActive(): Promise<number> {
    return this.userRepository.count({ where: { status: true } });
  }
}

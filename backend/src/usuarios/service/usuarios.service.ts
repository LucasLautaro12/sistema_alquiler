import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository: Repository<Usuario>,
    ) {}

    async findAll(): Promise<Usuario[]> {
        return this.userRepository.find();
    }

    async findOne(dni: number): Promise<Usuario>{
        const usuario = await this.userRepository.findOneBy({dni})
        if (!usuario){
            throw new NotFoundException(`Usuario no encontrado con el DNI: ${dni}`);
        }
        return usuario;
    }

    async create(data: CreateUsuarioDto): Promise<Usuario>{
        const usuario = this.userRepository.create(data);
        return this.userRepository.save(usuario);
    }

    async update(dni: number, data: UpdateUsuarioDto): Promise<Usuario>{
        const usuario = await this.findOne(dni);
        Object.assign(usuario, data);
        return this.userRepository.save(usuario);
    }
}

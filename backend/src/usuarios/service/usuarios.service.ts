import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuarios)
        private readonly userRepository: Repository<Usuarios>,
    ) {}

    async findAll(): Promise<Usuarios[]> {
        return this.userRepository.find();
    }

    async findOne(dni: number): Promise<Usuarios>{
        const usuario = await this.userRepository.findOneBy({dni})
        if (!usuario){
            throw new NotFoundException(`Usuario no encontrado con el DNI: ${dni}`);
        }
        return usuario;
    }   

    async create(data: CreateUsuarioDto): Promise<Usuarios>{
        const hash = await bcrypt.hash(data.contrasenia, SALT_ROUNDS)
        const usuario = this.userRepository.create({
            ...data,
            contrasenia: hash
        });
        return this.userRepository.save(usuario);
    }

    async update(dni: number, data: UpdateUsuarioDto): Promise<Usuarios>{
        const usuario = await this.findOne(dni);
        if (!usuario){
            throw new NotFoundException(`Usuario no encontrado con el DNI: ${dni}`);
        }
        
        Object.assign(usuario, data);
        return this.userRepository.save(usuario);
    }
}

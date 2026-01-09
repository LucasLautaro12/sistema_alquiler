import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from '../controller/usuarios.controller';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule { }

import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from '../service/usuarios.service';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    findAll() {
        console.log("Traer todos los usuarios")
        return this.usuariosService.findAll();
    }

    @Get(':dni')
    findOne(@Param('dni', ParseIntPipe) dni: number) {
        return this.usuariosService.findOne(dni);
    }

    @Post()
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @Patch(':dni')
    update(@Param('dni', ParseIntPipe) dni: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.usuariosService.update(dni, updateUsuarioDto);
    }

}

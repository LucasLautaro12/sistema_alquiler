import { Module } from '@nestjs/common';
import { CategoriasController } from '../controller/categorias.controller';
import { CategoriasService } from '../service/categorias.service';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}

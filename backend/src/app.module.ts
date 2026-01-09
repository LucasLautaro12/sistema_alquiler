import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsuariosModule } from './usuarios/modules/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UsuariosModule,
  ],
})
export class AppModule { }

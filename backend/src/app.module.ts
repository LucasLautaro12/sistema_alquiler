import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsuariosModule } from './usuarios/modules/usuarios.module';
import { GastosMensualesModule } from './gastos-mensuales/gastos-mensuales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UsuariosModule,
    GastosMensualesModule,
  ],
})
export class AppModule {}

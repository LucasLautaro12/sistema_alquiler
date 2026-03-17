import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuarios } from '../usuarios/entities/usuario.entity';
import { GastoMensual } from '../gastos-mensuales/entities/gasto-mensual.entity';
import { Balance } from '../balances/entities/balances.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'alquiler_db',
  entities: [Usuarios, GastoMensual, Balance],
  synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
};
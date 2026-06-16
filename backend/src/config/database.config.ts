import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USER', 'postgres'),
    password: configService.get('DB_PASS', 'postgres'),
    database: configService.get('DB_NAME', 'alquiler'),
    autoLoadEntities: true,
    migrationsRun: false,
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
  };
}

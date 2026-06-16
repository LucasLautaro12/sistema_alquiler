import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Sistema de Alquiler Compartido')
    .setDescription(
      `API para gestionar gastos mensuales de un alquiler compartido.\n\n` +
      `**Categorías de gastos:** Alquiler (efectivo), Gas, Luz/Agua, Limsa, Gastos Comunes\n\n` +
      `**Flujo de uso:**\n` +
      `1. Crear usuarios (POST /api/users)\n` +
      `2. Crear período mensual (POST /api/monthly-periods)\n` +
      `3. Registrar gastos del mes (POST /api/monthly-expenses)\n` +
      `4. Registrar quién pagó cada servicio (POST /api/expense-payments)\n` +
      `5. Consultar resumen con deudas calculadas (GET /api/reports/monthly-summary/:periodId)\n` +
      `6. Registrar contribuciones en efectivo (POST /api/cash-contributions)`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Servidor corriendo en: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs en:      http://localhost:${port}/api/docs\n`);
}

bootstrap();

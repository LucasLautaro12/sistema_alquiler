import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Validación global ───────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades extra
      transform: true,            // Convierte los tipos automáticamente (string→number etc.)
    }),
  );

  // ─── Prefijo global ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Swagger ─────────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Sistema de Alquiler Compartido')
    .setDescription(
      `API para gestionar gastos mensuales de un alquiler compartido entre convivientes.\n\n` +
      `**Flujo de uso:**\n` +
      `1. Crear los usuarios (\`POST /api/usuarios\`)\n` +
      `2. Registrar los gastos del mes (\`POST /api/gastos-mensuales\`)\n` +
      `3. Consultar el resumen con deudas calculadas (\`GET /api/gastos-mensuales/resumen/{anio}/{mes}\`)\n` +
      `4. Opcionalmente persistir los balances (\`POST /api/balances/generar/{anio}/{mes}\`)`,
    )
    .setVersion('1.0')
    .addTag('Usuarios', 'Gestión de los convivientes')
    .addTag('Gastos Mensuales', 'Registro de servicios y cálculo de deudas')
    .addTag('Balances', 'Persistencia de balances calculados por usuario y mes')
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
  console.log(`📚 Swagger docs en:        http://localhost:${port}/api/docs\n`);
}
bootstrap();
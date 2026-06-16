const { MigrationInterface, QueryRunner } = require('typeorm');

class SeedExpenseCategories1700000000001 {
  name = 'SeedExpenseCategories1700000000001';

  async up(queryRunner) {
    await queryRunner.query(`
      INSERT INTO "expense_categories" ("name", "code", "description", "is_cash_payment") VALUES
        ('Alquiler', 'RENT', 'Pago mensual de alquiler', true),
        ('Gas', 'GAS', 'Servicio de gas', false),
        ('Luz y Agua', 'WATER_ELECTRICITY', 'Servicio de luz y agua (factura única)', false),
        ('Limsa', 'LIMSA', 'Servicio de limpieza municipal', false),
        ('Gastos Comunes', 'BUILDING_FEES', 'Gastos comunes del edificio', false)
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DELETE FROM "expense_categories" WHERE "code" IN ('RENT', 'GAS', 'WATER_ELECTRICITY', 'LIMSA', 'BUILDING_FEES')
    `);
  }
}

module.exports = { SeedExpenseCategories1700000000001 };

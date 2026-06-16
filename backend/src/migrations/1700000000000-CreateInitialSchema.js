const { MigrationInterface, QueryRunner } = require('typeorm');

class CreateInitialSchema1700000000000 {
  name = 'CreateInitialSchema1700000000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "dni" INTEGER NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) DEFAULT 'user',
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_users_dni" ON "users" ("dni") WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email") WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "expense_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "code" VARCHAR(50) NOT NULL,
        "description" VARCHAR(255),
        "is_cash_payment" BOOLEAN DEFAULT false,
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_expense_categories_code" ON "expense_categories" ("code") WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "monthly_periods" (
        "id" SERIAL PRIMARY KEY,
        "year" INTEGER NOT NULL,
        "month" INTEGER NOT NULL,
        "is_closed" BOOLEAN DEFAULT false,
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_monthly_periods_year_month" ON "monthly_periods" ("year", "month") WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "monthly_expenses" (
        "id" SERIAL PRIMARY KEY,
        "monthly_period_id" INTEGER NOT NULL,
        "expense_category_id" INTEGER NOT NULL,
        "amount" DECIMAL(12, 2) NOT NULL,
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_monthly_expenses_period_category"
      ON "monthly_expenses" ("monthly_period_id", "expense_category_id")
      WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_monthly_expenses_period" ON "monthly_expenses" ("monthly_period_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_monthly_expenses_category" ON "monthly_expenses" ("expense_category_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "expense_payments" (
        "id" SERIAL PRIMARY KEY,
        "monthly_period_id" INTEGER NOT NULL,
        "expense_category_id" INTEGER NOT NULL,
        "user_id" INTEGER NOT NULL,
        "amount" DECIMAL(12, 2) NOT NULL,
        "payment_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        "notes" TEXT,
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_payments_period" ON "expense_payments" ("monthly_period_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_payments_category" ON "expense_payments" ("expense_category_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_payments_user" ON "expense_payments" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_expense_payments_date" ON "expense_payments" ("payment_date")
    `);

    await queryRunner.query(`
      CREATE TABLE "cash_contributions" (
        "id" SERIAL PRIMARY KEY,
        "monthly_period_id" INTEGER NOT NULL,
        "user_id" INTEGER NOT NULL,
        "amount" DECIMAL(12, 2) NOT NULL,
        "payment_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        "notes" TEXT,
        "status" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" INTEGER,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" INTEGER,
        "deleted_at" TIMESTAMP,
        "deleted_by" INTEGER
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_cash_contributions_period" ON "cash_contributions" ("monthly_period_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_cash_contributions_user" ON "cash_contributions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_cash_contributions_date" ON "cash_contributions" ("payment_date")
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" SERIAL PRIMARY KEY,
        "table_name" VARCHAR(100) NOT NULL,
        "record_id" INTEGER NOT NULL,
        "action" VARCHAR(20) NOT NULL,
        "old_values" JSONB,
        "new_values" JSONB,
        "user_id" INTEGER,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_table_record" ON "audit_logs" ("table_name", "record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_user" ON "audit_logs" ("user_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "monthly_expenses"
      ADD CONSTRAINT "fk_monthly_expenses_period"
      FOREIGN KEY ("monthly_period_id") REFERENCES "monthly_periods" ("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "monthly_expenses"
      ADD CONSTRAINT "fk_monthly_expenses_category"
      FOREIGN KEY ("expense_category_id") REFERENCES "expense_categories" ("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_payments"
      ADD CONSTRAINT "fk_expense_payments_period"
      FOREIGN KEY ("monthly_period_id") REFERENCES "monthly_periods" ("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_payments"
      ADD CONSTRAINT "fk_expense_payments_category"
      FOREIGN KEY ("expense_category_id") REFERENCES "expense_categories" ("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "expense_payments"
      ADD CONSTRAINT "fk_expense_payments_user"
      FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT
    `);

    await queryRunner.query(`
      ALTER TABLE "cash_contributions"
      ADD CONSTRAINT "fk_cash_contributions_period"
      FOREIGN KEY ("monthly_period_id") REFERENCES "monthly_periods" ("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "cash_contributions"
      ADD CONSTRAINT "fk_cash_contributions_user"
      FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "cash_contributions" DROP CONSTRAINT "fk_cash_contributions_user"`);
    await queryRunner.query(`ALTER TABLE "cash_contributions" DROP CONSTRAINT "fk_cash_contributions_period"`);
    await queryRunner.query(`ALTER TABLE "expense_payments" DROP CONSTRAINT "fk_expense_payments_user"`);
    await queryRunner.query(`ALTER TABLE "expense_payments" DROP CONSTRAINT "fk_expense_payments_category"`);
    await queryRunner.query(`ALTER TABLE "expense_payments" DROP CONSTRAINT "fk_expense_payments_period"`);
    await queryRunner.query(`ALTER TABLE "monthly_expenses" DROP CONSTRAINT "fk_monthly_expenses_category"`);
    await queryRunner.query(`ALTER TABLE "monthly_expenses" DROP CONSTRAINT "fk_monthly_expenses_period"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_contributions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense_payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "monthly_expenses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "monthly_periods"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expense_categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}

module.exports = { CreateInitialSchema1700000000000 };

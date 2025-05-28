import { Knex } from 'knex';

export async function createSymbolsTable(db: Knex) {
  const exists = await db.schema.hasTable('symbols');
  if (!exists) {
    await db.schema.createTable('symbols', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('currency');
      table.string('code');
      table.unique(['code', 'currency']);
    });
  }
}

export async function createReferencesTable(db: Knex) {
  const exists = await db.schema.hasTable('references');
  if (!exists) {
    await db.schema.createTable('references', (table) => {
      table.increments('id').primary();
      table.double('rate');
      table.time('date');
      table.integer('symbol').references('id').inTable('symbols');
    });
  }
}
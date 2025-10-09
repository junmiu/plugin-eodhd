import { knex } from 'knex';
import { createExchangesTable, createReferencesTable, createSymbolsTable } from './schema';
import { knexSqlite3Config } from './config';

export const db = knex(knexSqlite3Config);

export const run = async () => {
  await createSymbolsTable(db);
  await createReferencesTable(db);
  await createExchangesTable(db);
};
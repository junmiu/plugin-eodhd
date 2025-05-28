import type { Knex } from 'knex';

export const knexSqlite3Config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: true,
};
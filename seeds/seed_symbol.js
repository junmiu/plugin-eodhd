const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const insertSymbols = async (knex) => {
  const symbolsPath = path.join(__dirname, 'symbols.json');
  const symbols = JSON.parse(fs.readFileSync(symbolsPath, 'utf-8')).data;
  const n = 100;

  for (let i = 0; i < symbols.length; i += n) {
    const batch = symbols.slice(i, i + n).map(s => ({ name: s.Name, currency: s.Currency, code: s.Code }));
    await knex('symbols').insert(batch);
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('symbols').del();
  await knex('references').del();
  await insertSymbols(knex);
};
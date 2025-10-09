const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const insertExchanges = async (knex) => {
  const exchangesPath = path.join(__dirname, 'exchanges.json');
  const exchanges = JSON.parse(fs.readFileSync(exchangesPath, 'utf-8'));
  const n = 100;

  for (let i = 0; i < exchanges.length; i += n) {
    const batch = exchanges.slice(i, i + n).map(s => ({ name: s.Name, currency: s.Currency, code: s.Code, mic: s.OperatingMIC, country: s.Country }));
    await knex('exchanges').insert(batch);
  }
}

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
  await knex('exchanges').del();
  await insertExchanges(knex);
  await insertSymbols(knex);
};
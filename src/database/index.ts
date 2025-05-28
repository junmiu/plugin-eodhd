export { db, run } from './sqlite3';
export type Symbol = { code: string, name: string };
export type Reference = { base: number; symbol: number, date: string, rate: number };
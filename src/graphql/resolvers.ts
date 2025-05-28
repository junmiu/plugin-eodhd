import { db } from '../database';
import dotenv from 'dotenv';
import axios from 'axios';

type EODHDResponse = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close: number;
}

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret';

const formatDate2Number = (date?: string) => {
  return date ? parseInt(date.replace(/-/g, ''), 10) : NaN;
};

const formatDate2String = (date?: number) => {
  return date ? date.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '';
};

export const resolvers = {
  symbols: async (args: { option?: { limit?: number; cursor?: string } }) => {
    const { option } = args;

    try {
      // Base query for fetching symbols
      const baseQuery = db('symbols').select('id', 'code', 'name', 'currency');

      // Clone the base query to calculate the total count
      const totalQuery = baseQuery.clone().clearSelect().count('* as total');
      const totalResult = await totalQuery;
      const total = totalResult[0]?.total || 0;

      // Apply pagination options
      if (option?.cursor) {
        baseQuery.where('id', '>', option.cursor);
      }
      if (option?.limit) {
        baseQuery.limit(option.limit + 1); // Fetch one extra record to determine `hasNext`
      }

      // Execute the filtered query
      const results = await baseQuery;

      // Parse the results and handle pagination
      const nodes = results.slice(0, option?.limit || results.length);
      const hasNext = results.length > (option?.limit || 0);

      return {
        total, // Total count from the unfiltered base query
        nodes,
        info: {
          hasNext,
          cursor: nodes[nodes.length - 1]?.id || null,
        },
      };
    } catch (error) {
      console.error('Error fetching symbols:', error);
      throw new Error('Failed to fetch symbols');
    }
  },
  symbol: async (args: { code: string }) => {
    const { code } = args;
    return await db('symbols').where({ code }).first();
  },
  references: async (args: { startDate?: string; endDate?: string; symbol?: string, option?: { limit?: number; cursor?: string } }) => {
    const { startDate, endDate, symbol, option = {} } = args;
    const url = `https://eodhd.com/api/eod/${symbol}?from=${startDate}&to=${endDate}&period=d&api_token=${SECRET_KEY}&fmt=json`;
    const response = await axios.get<EODHDResponse[]>(url);
    const symbolData = await db('symbols').where({ code: symbol }).first();

    if (!symbolData) {
      throw new Error(`Symbol with code ${symbol} not found`);
    }

    return response.data.reduce((acc, d) => {
      acc.nodes.push({
        id: null,
        date: d.date,
        rate: d.close,
        symbol: symbolData,
      });
      return acc;
    }, {
      total: response.data.length,
      nodes: [] as any[],
      info: {
        hasNext: false, // Assuming no pagination for this example
        cursor: null, // No cursor in this case
      },
    });
  },
};
import { db } from '../database';
import axios from 'axios';
import { sign } from '../auth';

type EODHDResponse = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close: number;
}

export const resolvers = {
  auth: async (args: { apiKey: string }) => {
    return sign(args.apiKey);
  },
  symbols: async (args: { option?: { limit?: number; cursor?: string } }, context: { apiKey?: string }) => {
    if (!context.apiKey) {
      throw new Error('Failed to fetch symbols');
    }

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
  symbol: async (args: { code: string }, context: { apiKey?: string }) => {
    if (!context.apiKey) {
      throw new Error('Failed to fetch symbols');
    }

    const { code } = args;
    return await db('symbols').where({ code }).first();
  },
  references: async (args: { startDate?: string; endDate?: string; symbol?: string, option?: { limit?: number; cursor?: string } }, context: { apiKey?: string }) => {
    if (!context.apiKey) {
      throw new Error('Failed to fetch symbols');
    }

    const { startDate, endDate, symbol, option = {} } = args;
    const url = `https://eodhd.com/api/eod/${symbol}?from=${startDate}&to=${endDate}&period=d&api_token=${context.apiKey}&fmt=json`;
    const response = await axios.get<EODHDResponse[]>(url);
    const [, exchange] = symbol!.split('.');
    const name = symbol;
    let currency = 'USD';

    if (exchange) {
      const symbolData = await db('exchanges').where({ code: exchange }).first();
      if (symbolData) {
        currency = symbolData.currency;
      }
    }

    return response.data.reduce((acc, d) => {
      acc.nodes.push({
        id: null,
        date: d.date,
        rate: d.close,
        symbol: {
          code: symbol,
          name,
          currency,
        },
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
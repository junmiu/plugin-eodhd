import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import cors from 'cors';
import { sign, verify } from './auth';

export const app = express();

app.use(cors({
  origin: 'https://localhost:8081',
  methods: ['GET', 'POST'],
}));

// GraphQL endpoint
app.use('/graphql', createHandler({
  schema: schema,
  rootValue: resolvers,
  context: async (req) => {
    const headers = req.headers as { authorization?: string };
    const token = headers.authorization?.split(' ')[1];

    if (!token) {
      return {};
    }

    const apiKey = await verify(token);
    return { apiKey };
  },
}));
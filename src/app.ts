import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import cors from 'cors';

export const app = express();

app.use(cors({
  origin: 'https://localhost:8081',
  methods: ['GET', 'POST'],
}));

// GraphQL endpoint
app.use('/graphql', createHandler({
  schema: schema,
  rootValue: resolvers,
}));
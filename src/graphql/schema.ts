import { buildASTSchema } from 'graphql';
import { parse } from 'graphql';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load the schema from the .graphql file
const schemaPath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf8');

export const schema = buildASTSchema(parse(typeDefs));
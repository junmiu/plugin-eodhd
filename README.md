# plugin-eodhd

A Node.js plugin for working with EOD Historical Data, using Express, GraphQL, Knex, and SQLite.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update as needed:

```bash
cp .env.example .env
```

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

### Start (Production)

```bash
npm start
```

### Database Seeding

To seed the database with symbol data:

```bash
npm run seed
```

This will load data from `seeds/symbols.json` into the `symbols` table.

## Features

- REST and GraphQL APIs
- Database migrations and seeding with Knex
- Environment variable support via dotenv
- TypeScript support
- SQLite database (default)

## GraphQL API

The GraphQL API is defined in [`src/graphql/schema.graphql`](src/graphql/schema.graphql).

### Main Types

- **Symbol**: Represents a financial symbol (fields: `code`, `name`, `currency`)
- **Reference**: Represents a reference to a symbol, including `rate` and `date`
- **SymbolConnection**: Paginated list of symbols
- **ReferenceConnection**: Paginated list of references
- **Info**: Pagination information

### Queries

- `symbols(option: Option): SymbolConnection!`  
  Fetch a paginated list of symbols.

- `symbol(code: String!): Symbol!`  
  Fetch a specific symbol by its unique code.

- `references(symbol: String, startDate: Date, endDate: Date, option: Option): ReferenceConnection!`  
  Fetch a paginated list of references, filterable by symbol code and date range.

### Example Query

```graphql
query {
  symbols(option: { limit: 5 }) {
    total
    nodes {
      code
      name
      currency
    }
    info {
      cursor
      hasNext
    }
  }
}
```

### Custom Scalars

- `Date`: ISO 8601 date string

### Pagination

Use the `Option` input for pagination:
- `limit`: Number of items per page (default: 10)
- `cursor`: For cursor-based pagination

## Scripts

- `npm run build` – Compile TypeScript to JavaScript
- `npm run dev` – Start server in development mode
- `npm start` – Start server (after build)
- `npm run seed` – Seed the database
- `npm run copy:schema` – Copy GraphQL schema to the build output

## Project Structure

```
.
├── src/                # Source code (TypeScript)
├── dist/               # Compiled output (JavaScript)
├── seeds/              # Seed scripts and data
├── .env.example        # Example environment variables
├── package.json
└── README.md
```

## License

MIT
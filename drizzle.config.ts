import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  tablesFilter: ['/^(?!.*_cf_KV).*$/'],
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: 'your-cloudflare-account-id',
    databaseId: 'your-d1-database-id',
    token: 'an-api-token-that-has-d1-permissions',
  },
});
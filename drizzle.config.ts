import { defineConfig } from 'drizzle-kit'

// Only used to generate SQL from the schema. Wrangler applies it (npm run db:migrate:*), so no Cloudflare keys here.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/worker/db/schema.ts',
  out: './migrations',
})

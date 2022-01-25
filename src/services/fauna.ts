import fauna, { query } from 'faunadb';

const client = new fauna.Client({
  secret: process.env.FAUNA_API_KEY,
  domain: process.env.FAUNA_API_DOMAIN || undefined,
});

export { client, query };

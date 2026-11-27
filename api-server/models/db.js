const { Client } = require('pg');

function getPgClient() {
  return new Client({
    host:     process.env.POSTGRES_HOST,
    port:     process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
}

// Open a connection, run one SQL statement, always close the connection
async function query(sql) {
  const client = getPgClient();
  await client.connect();
  try {
    return await client.query(sql);
  } finally {
    await client.end();
  }
}

module.exports = { getPgClient, query };

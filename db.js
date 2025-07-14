const { Pool, Client } = require("pg");
require("dotenv").config();

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, DBNAME } = process.env;

const setupDatabase = async () => {
  // Step 1: Connect to default 'postgres' DB to create DB if needed
  const client = new Client({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT,
    database: "postgres",
  });

  await client.connect();

  const exists = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [DBNAME]
  );

  if (exists.rowCount === 0) {
    await client.query(`CREATE DATABASE ${DBNAME}`);
    console.log(`Database '${DBNAME}' created.`);
  } else {
    console.log(`Database '${DBNAME}' already exists.`);
  }

  await client.end();

  // Step 2: Create pool to your custom DB
  const pool = new Pool({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT,
    database: DBNAME,
  });

  // Step 3: Ensure users table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    )
  `);

  console.log("Table 'users' is ready.");
  return pool;
};

module.exports = setupDatabase;

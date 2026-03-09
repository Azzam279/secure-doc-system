import { Pool } from 'pg';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const secretManagerClient = new SecretManagerServiceClient();

let pool: Pool | null = null;

async function getDatabaseCredentials() {
  const projectId = process.env.GCP_PROJECT_ID;
  const secretName = `projects/${projectId}/secrets/cloudsql-db-credentials/versions/latest`;

  try {
    const [version] = await secretManagerClient.accessSecretVersion({
      name: secretName,
    });

    if (!version.payload || !version.payload.data) {
      throw new Error('Invalid secret payload received from Secret Manager.');
    }

    const payload = version.payload.data.toString('utf8');
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error accessing secret:', error);
    throw new Error('Failed to retrieve database credentials from Secret Manager.');
  }
}

async function connectToDatabaseWithAuthProxy() {
  if (pool) {
    return pool; // reuse existing pool
  }

  const credentials = await getDatabaseCredentials();
  const host = process.env.NODE_ENV === 'production' ? `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}` : 'localhost';

  pool = new Pool({
    host,
    user: credentials.username,
    password: credentials.password,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    max: 5, // limit connections per container
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as test');
    client.release(); // Release the client back to the pool
    console.log('Successfully connected to PostgreSQL via Auth Proxy:', result.rows);
    return pool; // Return the connection pool
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

export default connectToDatabaseWithAuthProxy;

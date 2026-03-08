import { Pool } from 'pg';
import { Connector, IpAddressTypes } from "@google-cloud/cloud-sql-connector";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const secretManagerClient = new SecretManagerServiceClient();
const connector = new Connector();

async function getDatabaseCredentials() {
  const projectNumber = process.env.GCP_PROJECT_NUMBER;
  const secretName = `projects/${projectNumber}/secrets/cloudsql-db-credentials/versions/latest`;

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
  const credentials = await getDatabaseCredentials();

  // const dbConfig = {
  //   user: credentials.username,
  //   password: credentials.password,
  //   database: 'document_db',
  //   host: '127.0.0.1',
  //   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  // };

  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: IpAddressTypes.PUBLIC,
  });

  const pool = new Pool({
    ...clientOpts,
    user: credentials.username,
    password: credentials.password,
    database: "document_db",
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

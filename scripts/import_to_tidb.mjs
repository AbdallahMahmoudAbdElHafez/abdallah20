import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({ path: path.resolve('server/.env') });
dotenv.config();

const sqlPath = process.argv[2] || path.resolve('server/backups/nurivina_erp_tidb_ready.sql');

const host = process.env.TIDB_HOST || process.env.DB_HOST;
const port = Number(process.env.TIDB_PORT || process.env.DB_PORT || 4000);
const user = process.env.TIDB_USER || process.env.DB_USER;
const password = process.env.TIDB_PASS || process.env.DB_PASS;

if (!host || !user || !password || host === 'localhost') {
    console.error('❌ Please set TIDB_HOST, TIDB_PORT=4000, TIDB_USER, TIDB_PASS environment variables first.');
    process.exit(1);
}

console.log(`Connecting to TiDB at ${host}:${port} as ${user}...`);

const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    },
});

try {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`Importing ${path.basename(sqlPath)} (${(sql.length / 1024 / 1024).toFixed(2)} MB)...`);
    await connection.query(sql);
    console.log('✅ Database imported successfully to TiDB!');
} finally {
    await connection.end();
}


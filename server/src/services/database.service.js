
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';
import { sequelize } from '../config/db.js';

const execPromise = promisify(exec);

export class DatabaseService {
    static async listDatabases() {
        const [results] = await sequelize.query('SHOW DATABASES;');
        return results.map(r => r.Database).filter(db => !['information_schema', 'mysql', 'performance_schema', 'sys'].includes(db));
    }

    static async backupDatabase(dbName) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.join(process.cwd(), 'backups');

        try {
            await fs.access(backupDir);
        } catch {
            await fs.mkdir(backupDir);
        }

        const fileName = `${dbName}_backup_${timestamp}.sql`;
        const filePath = path.join(backupDir, fileName);

        // Note: This assumes mysqldump is in the PATH
        const command = `mysqldump -u ${env.db.user} -p${env.db.pass} ${dbName} > "${filePath}"`;

        await execPromise(command);
        return { fileName, filePath };
    }

    static async switchDatabase(dbName) {
        const envPath = path.join(process.cwd(), '.env');
        let envContent = await fs.readFile(envPath, 'utf8');

        const dbNameRegex = /^DB_NAME=.*$/m;
        if (dbNameRegex.test(envContent)) {
            envContent = envContent.replace(dbNameRegex, `DB_NAME=${dbName}`);
        } else {
            envContent += `\nDB_NAME=${dbName}`;
        }

        await fs.writeFile(envPath, envContent);

        // Trigger server restart by touching a watched file if necessary, 
        // but node --watch might not watch .env. 
        // Let's touch src/server.js to be sure.
        const serverJsPath = path.join(process.cwd(), 'src', 'server.js');
        const serverJsContent = await fs.readFile(serverJsPath, 'utf8');
        await fs.writeFile(serverJsPath, serverJsContent);

        return { success: true, message: `Switched to ${dbName}. Server is restarting...` };
    }

    static verifyPassword(password) {
        return password === env.dbMgmtPassword;
    }
}

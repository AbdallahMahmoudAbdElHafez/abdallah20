import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2';
import { env } from '../config/env.js';
import { sequelize } from '../models/index.js';

export class DatabaseService {
    static async listDatabases() {
        const [results] = await sequelize.query('SHOW DATABASES;');
        return results
            .map((r) => r.Database)
            .filter(
                (db) =>
                    ![
                        'information_schema',
                        'mysql',
                        'performance_schema',
                        'sys',
                        'METRICS_SCHEMA',
                    ].includes(db)
            );
    }

    static async backupDatabase(dbName) {
        const allowedDbs = await this.listDatabases();
        if (!allowedDbs.includes(dbName)) {
            throw new Error(`قاعدة البيانات "${dbName}" غير موجودة`);
        }

        const safeDb = `\`${dbName.replace(/`/g, '``')}\``;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${dbName}_backup_${timestamp}.sql`;

        const lines = [
            `-- Nurivina ERP SQL Backup`,
            `-- Database: ${dbName}`,
            `-- Generated: ${new Date().toISOString()}`,
            `SET FOREIGN_KEY_CHECKS = 0;`,
            `SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';`,
            `CREATE DATABASE IF NOT EXISTS ${safeDb} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
            `USE ${safeDb};`,
            '',
        ];

        const [tableRows] = await sequelize.query(
            `SHOW FULL TABLES FROM ${safeDb};`
        );

        const baseTables = [];
        const views = [];
        for (const row of tableRows) {
            const values = Object.values(row);
            const name = values[0];
            const type = values[1];
            if (type === 'VIEW') views.push(name);
            else baseTables.push(name);
        }

        // 1. Export all base tables (structure + data)
        for (const table of baseTables) {
            const safeTable = `\`${table.replace(/`/g, '``')}\``;
            const [createRows] = await sequelize.query(
                `SHOW CREATE TABLE ${safeDb}.${safeTable};`
            );
            const createSql =
                createRows[0]?.['Create Table'] || Object.values(createRows[0])[1];

            lines.push(`-- Table: ${table}`);
            lines.push(`DROP TABLE IF EXISTS ${safeTable};`);
            lines.push(`${createSql};`);

            const [rows] = await sequelize.query(
                `SELECT * FROM ${safeDb}.${safeTable};`
            );

            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const colList = columns
                    .map((c) => `\`${c.replace(/`/g, '``')}\``)
                    .join(', ');

                const batchSize = 100;
                for (let i = 0; i < rows.length; i += batchSize) {
                    const batch = rows.slice(i, i + batchSize);
                    const valuesSql = batch
                        .map((row) => {
                            const vals = columns.map((col) =>
                                mysql.escape(row[col])
                            );
                            return `(${vals.join(', ')})`;
                        })
                        .join(',\n');
                    lines.push(
                        `INSERT INTO ${safeTable} (${colList}) VALUES\n${valuesSql};`
                    );
                }
            }
            lines.push('');
        }

        // 2. Export all views (without DEFINER for TiDB/MySQL portability)
        for (const view of views) {
            const safeView = `\`${view.replace(/`/g, '``')}\``;
            const [createRows] = await sequelize.query(
                `SHOW CREATE VIEW ${safeDb}.${safeView};`
            );
            let createSql =
                createRows[0]?.['Create View'] || Object.values(createRows[0])[1];
            createSql = createSql
                .replace(/DEFINER=`[^`]+`@`[^`]+`\s*/g, '')
                .replace(/SQL SECURITY DEFINER\s*/gi, '');

            lines.push(`-- View: ${view}`);
            lines.push(`DROP VIEW IF EXISTS ${safeView};`);
            lines.push(`${createSql};`);
            lines.push('');
        }

        lines.push(`SET FOREIGN_KEY_CHECKS = 1;`);
        const sqlContent = lines.join('\n');

        // Also save a local copy when not running on Vercel Serverless
        let filePath = null;
        if (!env.isVercel) {
            try {
                const backupDir = path.join(process.cwd(), 'backups');
                await fs.mkdir(backupDir, { recursive: true });
                filePath = path.join(backupDir, fileName);
                await fs.writeFile(filePath, sqlContent, 'utf8');
            } catch (err) {
                console.warn('[Backup] Could not save local backup copy:', err.message);
            }
        }

        return {
            fileName,
            filePath,
            sqlContent,
            tablesCount: baseTables.length,
            viewsCount: views.length,
        };
    }

    static async switchDatabase(dbName) {
        if (env.isVercel) {
            throw new Error(
                'تبديل قاعدة البيانات عبر ملف .env غير متاح على Vercel. عدّل متغير DB_NAME من إعدادات Vercel.'
            );
        }
        const envPath = path.join(process.cwd(), '.env');
        let envContent = await fs.readFile(envPath, 'utf8');

        const dbNameRegex = /^DB_NAME=.*$/m;
        if (dbNameRegex.test(envContent)) {
            envContent = envContent.replace(dbNameRegex, `DB_NAME=${dbName}`);
        } else {
            envContent += `\nDB_NAME=${dbName}`;
        }

        await fs.writeFile(envPath, envContent);

        const serverJsPath = path.join(process.cwd(), 'src', 'server.js');
        const serverJsContent = await fs.readFile(serverJsPath, 'utf8');
        await fs.writeFile(serverJsPath, serverJsContent);

        return {
            success: true,
            message: `Switched to ${dbName}. Server is restarting...`,
        };
    }

    static verifyPassword(password) {
        return password === env.dbMgmtPassword;
    }
}

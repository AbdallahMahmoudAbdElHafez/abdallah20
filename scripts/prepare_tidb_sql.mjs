import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2] || path.resolve('server/backups/nurivina_erp_backup_2026-11-24T08-42-21-905Z.sql');
const outputPath = process.argv[3] || path.resolve('server/backups/nurivina_erp_tidb_ready.sql');
const dbName = process.argv[4] || 'nurivina_erp';

const rawSql = fs.readFileSync(inputPath, 'utf8');

const origTables = (rawSql.match(/^CREATE TABLE /gm) || []).length;
const origInserts = (rawSql.match(/^INSERT INTO /gm) || []).length;
const origViews = (rawSql.match(/^\/\*!50001 VIEW `/gm) || []).length;

let sql = rawSql;

// 1. Remove MySQL TRIGGER blocks (TiDB does not support triggers)
// Matches from the /*!50003 SET @saved_cs_client ... or DELIMITER ;; through DELIMITER ;
sql = sql.replace(/DELIMITER ;;\r?\n[\s\S]*?DELIMITER ;\r?\n/g, '-- [TiDB] Trigger block removed (unsupported in TiDB)\n');

// 2. Remove DEFINER clauses and SQL SECURITY DEFINER on views (TiDB Cloud rejects root@localhost definer)
sql = sql.replace(/\/\*!50013 DEFINER=`[^`]+`@`[^`]+` SQL SECURITY DEFINER \*\/\r?\n?/g, '');
sql = sql.replace(/DEFINER=`[^`]+`@`[^`]+`\s*/g, '');

// 3. Convert utf8mb4_0900_ai_ci to utf8mb4_unicode_ci for universal TiDB compatibility
sql = sql.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');

// 4. Prepend database creation & selection
const header = [
    `-- TiDB-compatible dump generated from ${path.basename(inputPath)}`,
    `-- Generated at: ${new Date().toISOString()}`,
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    `USE \`${dbName}\`;`,
    '',
].join('\n');

sql = header + sql;

fs.writeFileSync(outputPath, sql, 'utf8');

const outTables = (sql.match(/^CREATE TABLE /gm) || []).length;
const outInserts = (sql.match(/^INSERT INTO /gm) || []).length;
const outViews = (sql.match(/^\/\*!50001 VIEW `/gm) || []).length;
const remainingTriggers = (sql.match(/CREATE[\s\S]{0,80}TRIGGER/g) || []).length;
const remainingDefiners = (sql.match(/DEFINER=/g) || []).length;

console.log('✅ TiDB SQL generated:', outputPath);
console.log(`   Tables:  ${origTables} -> ${outTables}`);
console.log(`   Inserts: ${origInserts} -> ${outInserts}`);
console.log(`   Views:   ${origViews} -> ${outViews}`);
console.log(`   Remaining Triggers: ${remainingTriggers}`);
console.log(`   Remaining Definers: ${remainingDefiners}`);

if (origTables !== outTables || origInserts !== outInserts || origViews !== outViews) {
    console.error('❌ Mismatch detected! Please inspect the output file.');
    process.exit(1);
}


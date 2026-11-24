
import zlib from 'zlib';
import { DatabaseService } from '../services/database.service.js';

export const getDatabases = async (req, res, next) => {
    try {
        const databases = await DatabaseService.listDatabases();
        res.json(databases);
    } catch (error) {
        next(error);
    }
};

export const backup = async (req, res, next) => {
    const { dbName, password } = req.body;
    try {
        if (!DatabaseService.verifyPassword(password)) {
            return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
        }
        const result = await DatabaseService.backupDatabase(dbName);
        res.setHeader('Content-Type', 'application/sql; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${result.fileName}"`
        );
        res.setHeader('X-Backup-Filename', result.fileName);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, X-Backup-Filename');
        if ((req.headers['accept-encoding'] || '').includes('gzip')) {
            const compressed = zlib.gzipSync(Buffer.from(result.sqlContent, 'utf8'));
            res.setHeader('Content-Encoding', 'gzip');
            return res.send(compressed);
        }
        res.send(result.sqlContent);
    } catch (error) {
        next(error);
    }
};

export const switchDb = async (req, res, next) => {
    const { dbName, password } = req.body;
    try {
        if (!DatabaseService.verifyPassword(password)) {
            return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
        }
        const result = await DatabaseService.switchDatabase(dbName);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyPassword = async (req, res, next) => {
    const { password } = req.body;
    try {
        if (DatabaseService.verifyPassword(password)) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        next(error);
    }
};

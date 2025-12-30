
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
        res.json({ message: 'تم عمل النسخة الاحتياطية بنجاح', ...result });
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

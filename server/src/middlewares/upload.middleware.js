import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? '/tmp/uploads/companies' : 'uploads/companies';

function ensureUploadDir() {
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (err) {
        console.warn('[Upload] Could not create upload directory:', err.message);
    }
}

ensureUploadDir();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureUploadDir();
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;

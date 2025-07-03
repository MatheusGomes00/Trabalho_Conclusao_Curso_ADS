import multer from 'multer';
import path from 'path';
import fs from 'fs';

const pastaUpload = path.resolve('uploads', 'documentos');
fs.mkdirSync(pastaUpload, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUpload);
  },
  filename: (req, file, cb) => {
    const suffix = file.fieldname; // 'refDocFrente', 'refDocVerso', 'refSelfie'
    const ext = path.extname(file.originalname);
    cb(null, `${suffix}_${req.user.id}${ext}`);
  }
});

export const uploadDocs = multer({ storage });

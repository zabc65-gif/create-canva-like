import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';
import type { UploadResponse } from '@create/shared';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800', 10); // 50MB

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Vidéos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const uploadRoutes = Router();

// POST /api/uploads - Upload un fichier
uploadRoutes.post('/', upload.single('file'), (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Aucun fichier fourni', 400, 'NO_FILE'));
  }

  const response: UploadResponse = {
    id: path.basename(req.file.filename, path.extname(req.file.filename)),
    url: `/uploads/${req.file.filename}`,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  };

  res.status(201).json({
    success: true,
    data: response,
  });
});

// POST /api/uploads/multiple - Upload plusieurs fichiers
uploadRoutes.post('/multiple', upload.array('files', 10), (req, res, next) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return next(new AppError('Aucun fichier fourni', 400, 'NO_FILES'));
  }

  const responses: UploadResponse[] = files.map((file) => ({
    id: path.basename(file.filename, path.extname(file.filename)),
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  }));

  res.status(201).json({
    success: true,
    data: responses,
  });
});

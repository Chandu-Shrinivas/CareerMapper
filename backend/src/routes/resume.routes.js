import express from 'express';
import multer from 'multer';
import { processResume } from '../controllers/resume.controller.js';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/extract-skills', upload.single('file'), processResume);

export default router;

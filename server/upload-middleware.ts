import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure storage for agent photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/agent-photos/');
  },
  filename: (req, file, cb) => {
    // Create secure filename: agent-[timestamp].[extension]
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `agent-${timestamp}${ext}`;
    cb(null, filename);
  }
});

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Export middleware for single photo upload
export const uploadAgentPhoto = upload.single('photo');
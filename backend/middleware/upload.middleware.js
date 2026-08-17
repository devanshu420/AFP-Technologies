import multer from 'multer';

const storage = multer.memoryStorage();

// 1. Filter for Images only (JPG, PNG, WEBP, SVG)
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! (PNG, JPG, WEBP)'), false);
  }
};

// 2. Filter for Documents & PDFs (PDF, Docs)
const documentFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/octet-stream' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Middleware for image upload (Max 15MB)
export const uploadImageMiddleware = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

// Middleware for PDF/Document upload (Max 30MB)
export const uploadPdfMiddleware = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});

// Default fallback export
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});
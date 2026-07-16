const express = require('express');
const multer = require('multer');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['text/plain', 'text/markdown', 'application/octet-stream'];
    const extensionAllowed = ['.txt', '.md'];
    const hasAllowedMime = allowed.includes(file.mimetype);
    const hasAllowedExt = extensionAllowed.some((ext) => file.originalname.toLowerCase().endsWith(ext));

    if (hasAllowedMime && hasAllowedExt) {
      return cb(null, true);
    }
    cb(new Error('Only .txt and .md files are allowed'));
  },
  limits: {
    fileSize: 1024 * 1024
  }
});

router.use(authMiddleware);
router.post('/import', upload.single('file'), fileController.importFile);

module.exports = router;

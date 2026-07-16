const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/:id', shareController.shareDocument);
router.get('/:id', shareController.getShares);
router.delete('/:id', shareController.unshareDocument);

module.exports = router;

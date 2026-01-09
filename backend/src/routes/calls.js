const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.post('/', callController.createCall);
router.get('/', callController.getCalls);
router.get('/:id', callController.getCallById);
router.put('/:id', callController.updateCall);
router.delete('/:id', callController.deleteCall);
router.post('/:id/recording', upload.single('recording'), callController.uploadRecording);

module.exports = router;

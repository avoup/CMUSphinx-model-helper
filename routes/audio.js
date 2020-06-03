const express = require('express');

const router = express.Router();

const audioController = require('../controllers/audio');

// env middleware
router.all('/', audioController.environment);

router.get('/', audioController.getAudio);

router.post('/', audioController.postAudio);

router.post('/listen', audioController.playAudio);

router.get('/stop-recording', audioController.stopRecording);

router.post('/clear', audioController.clearFiles);

router.post('/remove', audioController.removeAudio);

module.exports = router;
const express = require('express');

const router = express.Router();
const lmController = require('../controllers/lm');

// noinspection DuplicatedCode
router.get('/', lmController.getLm);

router.post('/', lmController.postSentence);

router.post('/clear', lmController.clearFile);

router.post('/remove', lmController.removeLine);

router.post('/submit', lmController.submit);

module.exports = router;
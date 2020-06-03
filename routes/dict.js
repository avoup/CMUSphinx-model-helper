const express = require('express');

const router = express.Router();

const dictController = require('../controllers/dict');

router.get('/', dictController.getDict);

router.post('/', dictController.addWord);

router.post('/clear', dictController.clearFile);

router.post('/remove', dictController.removeLine);

router.post('/submit', dictController.submit);

module.exports = router;


const express = require('express');

const router = express.Router();

const listController = require('../controllers/list');

router.post('/add', listController.add);

router.post('/update', listController.update);

router.post('/remove', listController.remove);

router.post('/reset', listController.reset);

module.exports = router;
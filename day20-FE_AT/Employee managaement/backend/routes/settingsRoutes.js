const express = require('express');
const router = express.Router();
const { getSettings, createSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../controllers/authController');

router.route('/')
  .get(getSettings)
  .post(protect, createSettings);

router.route('/:id')
  .put(protect, updateSettings);

module.exports = router;

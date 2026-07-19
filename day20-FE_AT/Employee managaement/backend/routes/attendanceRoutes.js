const express = require('express');
const router = express.Router();
const { getAllAttendance, markAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../controllers/authController');

router.route('/')
  .get(protect, getAllAttendance)
  .post(protect, markAttendance);

router.route('/:id')
  .put(protect, updateAttendance)
  .delete(protect, deleteAttendance);

module.exports = router;

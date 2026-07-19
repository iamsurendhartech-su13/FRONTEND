const express = require('express');
const router = express.Router();
const { getAllSalary, addSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');
const { protect } = require('../controllers/authController');

router.route('/')
  .get(protect, getAllSalary)
  .post(protect, addSalary);

router.route('/:id')
  .put(protect, updateSalary)
  .delete(protect, deleteSalary);

module.exports = router;

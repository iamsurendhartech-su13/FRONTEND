const express = require('express');
const router = express.Router();
const { getAllDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect } = require('../controllers/authController');

router.route('/')
  .get(protect, getAllDepartments)
  .post(protect, createDepartment);

router.route('/:id')
  .delete(protect, deleteDepartment);

module.exports = router;

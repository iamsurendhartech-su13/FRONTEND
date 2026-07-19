const { Department } = require('../models');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json({
      success: true,
      message: 'Departments retrieved successfully',
      data: departments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating department', error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    await department.destroy();
    res.json({
      success: true,
      message: 'Department deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

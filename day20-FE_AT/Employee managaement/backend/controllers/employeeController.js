const { Employee, Department } = require('../models');
const { Op } = require('sequelize');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: Department, attributes: ['name', 'head'] }]
    });
    res.json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{ model: Department, attributes: ['name', 'head'] }]
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    // Generate simple ID
    const count = await Employee.count();
    const newId = `EMP${(count + 1).toString().padStart(3, '0')}`;
    
    // Find department to link ID
    let deptId = null;
    if (req.body.department) {
      const dept = await Department.findOne({ where: { name: req.body.department.trim() } });
      if (dept) {
        deptId = dept.id;
        dept.count += 1;
        await dept.save();
      }
    }

    const employee = await Employee.create({
      ...req.body,
      employeeId: newId,
      departmentId: deptId,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=14b8a6&color=fff`
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Error creating employee', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Handle department change logic for counts and linking
    if (req.body.department && req.body.department !== employee.department) {
      const oldDeptName = employee.department ? employee.department.trim() : null;
      const newDeptName = req.body.department ? req.body.department.trim() : null;

      if (oldDeptName) {
        const oldDept = await Department.findOne({ where: { name: oldDeptName } });
        if (oldDept && oldDept.count > 0) {
          oldDept.count -= 1;
          await oldDept.save();
        }
      }

      const newDept = await Department.findOne({ where: { name: newDeptName } });
      if (newDept) {
        req.body.departmentId = newDept.id;
        newDept.count += 1;
        await newDept.save();
      } else {
        req.body.departmentId = null;
      }
    }

    await employee.update(req.body);
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating employee', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (employee.department) {
      const dept = await Department.findOne({ where: { name: employee.department.trim() } });
      if (dept && dept.count > 0) {
        dept.count -= 1;
        await dept.save();
      }
    }

    await employee.destroy();
    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

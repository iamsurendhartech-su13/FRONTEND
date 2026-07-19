const { Salary, Employee } = require('../models');

const getInternalEmployeeId = async (empIdInput) => {
  if (!empIdInput) return null;
  if (typeof empIdInput === 'string' && (empIdInput.startsWith('EMP') || isNaN(Number(empIdInput)))) {
    const emp = await Employee.findOne({ where: { employeeId: empIdInput } });
    return emp ? emp.id : null;
  }
  return Number(empIdInput);
};

exports.getAllSalary = async (req, res) => {
  try {
    const salaries = await Salary.findAll({
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });

    const formatted = salaries.map(rec => {
      const emp = rec.Employee || {};
      return {
        id: rec.id,
        employeeId: emp.employeeId || rec.employeeId,
        employeeName: emp.name || '',
        department: emp.department || '',
        salaryMonth: rec.month,
        basicSalary: rec.basic,
        bonus: rec.bonus,
        deductions: rec.deduction,
        netSalary: rec.net,
        paymentStatus: rec.status,
        createdAt: rec.createdAt,
        updatedAt: rec.updatedAt
      };
    });

    res.json({
      success: true,
      message: 'Salaries retrieved successfully',
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.addSalary = async (req, res) => {
  try {
    const { employeeId, salaryMonth, basicSalary, bonus, deductions, paymentStatus } = req.body;
    const internalEmpId = await getInternalEmployeeId(employeeId);
    
    if (!internalEmpId) {
      return res.status(400).json({ success: false, message: 'Invalid employee reference' });
    }

    const net = Number(basicSalary) + Number(bonus || 0) - Number(deductions || 0);
    
    const salary = await Salary.create({
      employeeId: internalEmpId,
      month: salaryMonth,
      basic: basicSalary,
      bonus: bonus || 0,
      deduction: deductions || 0,
      net,
      status: paymentStatus || 'Pending'
    });
    
    const newRecord = await Salary.findByPk(salary.id, {
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });
    
    const emp = newRecord.Employee || {};
    const formatted = {
      id: newRecord.id,
      employeeId: emp.employeeId || newRecord.employeeId,
      employeeName: emp.name || '',
      department: emp.department || '',
      salaryMonth: newRecord.month,
      basicSalary: newRecord.basic,
      bonus: newRecord.bonus,
      deductions: newRecord.deduction,
      netSalary: newRecord.net,
      paymentStatus: newRecord.status,
      createdAt: newRecord.createdAt,
      updatedAt: newRecord.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'Salary record created successfully',
      data: formatted
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding salary record', error: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const record = await Salary.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const { employeeId, salaryMonth, basicSalary, bonus, deductions, paymentStatus } = req.body;
    
    let internalEmpId = record.employeeId;
    if (employeeId) {
      internalEmpId = await getInternalEmployeeId(employeeId);
    }

    const net = Number(basicSalary !== undefined ? basicSalary : record.basic) + 
                Number(bonus !== undefined ? bonus : record.bonus) - 
                Number(deductions !== undefined ? deductions : record.deduction);

    await record.update({
      employeeId: internalEmpId,
      month: salaryMonth !== undefined ? salaryMonth : record.month,
      basic: basicSalary !== undefined ? basicSalary : record.basic,
      bonus: bonus !== undefined ? bonus : record.bonus,
      deduction: deductions !== undefined ? deductions : record.deduction,
      net,
      status: paymentStatus !== undefined ? paymentStatus : record.status
    });

    const updatedRecord = await Salary.findByPk(record.id, {
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });

    const emp = updatedRecord.Employee || {};
    const formatted = {
      id: updatedRecord.id,
      employeeId: emp.employeeId || updatedRecord.employeeId,
      employeeName: emp.name || '',
      department: emp.department || '',
      salaryMonth: updatedRecord.month,
      basicSalary: updatedRecord.basic,
      bonus: updatedRecord.bonus,
      deductions: updatedRecord.deduction,
      netSalary: updatedRecord.net,
      paymentStatus: updatedRecord.status,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt
    };

    res.json({
      success: true,
      message: 'Salary record updated successfully',
      data: formatted
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating salary record', error: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByPk(req.params.id);
    if (!salary) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    await salary.destroy();
    res.json({
      success: true,
      message: 'Salary record deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

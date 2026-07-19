const { Attendance, Employee } = require('../models');

const getInternalEmployeeId = async (empIdInput) => {
  if (!empIdInput) return null;
  if (typeof empIdInput === 'string' && (empIdInput.startsWith('EMP') || isNaN(Number(empIdInput)))) {
    const emp = await Employee.findOne({ where: { employeeId: empIdInput } });
    return emp ? emp.id : null;
  }
  return Number(empIdInput);
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });
    
    const formatted = attendance.map(rec => {
      const emp = rec.Employee || {};
      return {
        id: rec.id,
        employeeId: emp.employeeId || rec.employeeId,
        employeeName: emp.name || '',
        department: emp.department || '',
        date: rec.date,
        status: rec.status,
        timeIn: rec.timeIn,
        timeOut: rec.timeOut,
        createdAt: rec.createdAt,
        updatedAt: rec.updatedAt
      };
    });

    res.json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, timeIn, timeOut } = req.body;
    const internalEmpId = await getInternalEmployeeId(employeeId);
    
    if (!internalEmpId) {
      return res.status(400).json({ success: false, message: 'Invalid employee reference' });
    }
    
    let attendance = await Attendance.findOne({ where: { employeeId: internalEmpId, date } });
    
    if (attendance) {
      await attendance.update({ status, timeIn, timeOut });
    } else {
      attendance = await Attendance.create({ employeeId: internalEmpId, date, status, timeIn, timeOut });
    }
    
    const updatedRecord = await Attendance.findByPk(attendance.id, {
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });
    
    const emp = updatedRecord.Employee || {};
    const formatted = {
      id: updatedRecord.id,
      employeeId: emp.employeeId || updatedRecord.employeeId,
      employeeName: emp.name || '',
      department: emp.department || '',
      date: updatedRecord.date,
      status: updatedRecord.status,
      timeIn: updatedRecord.timeIn,
      timeOut: updatedRecord.timeOut,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt
    };
    
    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: formatted
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    
    let internalEmpId = record.employeeId;
    if (req.body.employeeId) {
      internalEmpId = await getInternalEmployeeId(req.body.employeeId);
    }
    
    await record.update({
      ...req.body,
      employeeId: internalEmpId
    });
    
    const updatedRecord = await Attendance.findByPk(record.id, {
      include: [{ model: Employee, attributes: ['name', 'employeeId', 'department'] }]
    });
    
    const emp = updatedRecord.Employee || {};
    const formatted = {
      id: updatedRecord.id,
      employeeId: emp.employeeId || updatedRecord.employeeId,
      employeeName: emp.name || '',
      department: emp.department || '',
      date: updatedRecord.date,
      status: updatedRecord.status,
      timeIn: updatedRecord.timeIn,
      timeOut: updatedRecord.timeOut,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt
    };
    
    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: formatted
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating attendance record', error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    await attendance.destroy();
    res.json({
      success: true,
      message: 'Attendance record deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

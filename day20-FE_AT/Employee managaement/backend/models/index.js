const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const Employee = require('./Employee')(sequelize, DataTypes);
const Department = require('./Department')(sequelize, DataTypes);
const Attendance = require('./Attendance')(sequelize, DataTypes);
const Salary = require('./Salary')(sequelize, DataTypes);
const Settings = require('./Settings')(sequelize, DataTypes);

// Define associations if needed
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

Employee.hasMany(Attendance, { foreignKey: 'employeeId' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Salary, { foreignKey: 'employeeId' });
Salary.belongsTo(Employee, { foreignKey: 'employeeId' });

module.exports = {
  sequelize,
  User,
  Employee,
  Department,
  Attendance,
  Salary,
  Settings
};

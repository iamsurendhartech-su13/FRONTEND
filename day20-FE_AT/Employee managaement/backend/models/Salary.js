module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define('Salary', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    basic: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    bonus: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    deduction: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    net: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Paid'
    }
  });
  return Salary;
};

module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeIn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timeOut: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return Attendance;
};

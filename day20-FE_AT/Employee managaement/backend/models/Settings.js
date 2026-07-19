module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define('Settings', {
    companyName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    companyAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    themeMode: {
      type: DataTypes.STRING,
      defaultValue: 'light'
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Settings;
};

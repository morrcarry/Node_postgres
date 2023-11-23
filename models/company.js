const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.User, {
        foreignKey: 'company_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Company.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    address: DataTypes.STRING,
    superAdminId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Company', // Correct model name in PascalCase
  });

  return Company;
};

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Company, {
        foreignKey: 'company_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING, // Update the phone data type
    public_key: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'superadmin', 'employee'),
    created_by: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User', // Correct model name in PascalCase
  });

  return User;
};

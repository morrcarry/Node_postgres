module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Name is required
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true, // Logo is required
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false, // Address is required
      },
      superAdminId: {
        type: Sequelize.INTEGER,
        allowNull: false, // SuperAdminId is required
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        validate: {
          isDate: true, // Validate createdAt as a date
        },
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        validate: {
          isDate: true, // Validate updatedAt as a date
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Companies');
  },
};

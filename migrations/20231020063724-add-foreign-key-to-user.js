/** @type {import('sequelize').Sequelize} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies', // Make sure it matches the actual table name in PascalCase
        key: 'id', // Name of the referenced column (usually the primary key)
      },
      onUpdate: 'CASCADE', // Add these back if you want the desired behaviors
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'company_id');
  },
};

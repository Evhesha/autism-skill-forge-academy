'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Удаляем проблемную запись из SequelizeMeta
    await queryInterface.sequelize.query(`
      DELETE FROM "SequelizeMeta" 
      WHERE name = '20260307104459-init-all-tables.js'
    `);
    console.log('✅ Проблемная миграция удалена из SequelizeMeta');
  },

  async down(queryInterface, Sequelize) {
    // Ничего не делаем
  }
};
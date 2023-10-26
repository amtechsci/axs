'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(25),
        defaultValue: null
      },
      email: {
        type: Sequelize.STRING(55),
        defaultValue: null
      },
      mobile: {
        type: Sequelize.BIGINT,
        defaultValue: null
      },
      gender: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        comment: 'male=1,female=2'
      },
      profile_img: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
      otp: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      pin: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      device_token: {
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      device_id: {
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};

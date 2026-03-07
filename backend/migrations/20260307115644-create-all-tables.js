'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Создаем ENUM тип для subscription_tier
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_users_subscription_tier" AS ENUM('free', 'premium');
    `);

    // Создаем таблицу users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      is_subscribed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      subscription_tier: {
        type: 'enum_users_subscription_tier',
        defaultValue: 'free',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Создаем таблицу lessons
    await queryInterface.createTable('lessons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      is_free: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
    });

    // Создаем таблицу user_progress
    await queryInterface.createTable('user_progress', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lessons',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      current_step: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      last_accessed: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Добавляем уникальный индекс
    await queryInterface.addIndex('user_progress', ['user_id', 'lesson_id'], {
      unique: true,
      name: 'user_progress_user_lesson_unique'
    });

    // Создаем таблицу quiz_results
    await queryInterface.createTable('quiz_results', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lessons',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      answers: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем таблицы в обратном порядке
    await queryInterface.dropTable('quiz_results');
    await queryInterface.dropTable('user_progress');
    await queryInterface.dropTable('lessons');
    await queryInterface.dropTable('users');
    
    // Удаляем ENUM тип
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_subscription_tier";');
  }
};

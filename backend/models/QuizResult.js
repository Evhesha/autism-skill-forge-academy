// models/QuizResult.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuizResult = sequelize.define('QuizResult', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'lesson_id',
      references: {
        model: 'lessons',
        key: 'id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Массив ответов пользователя на вопросы теста',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'quiz_results',
    timestamps: false,
    underscored: true,
  });

  return QuizResult;
};
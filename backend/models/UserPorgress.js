// models/UserProgress.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProgress = sequelize.define('UserProgress', {
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
    currentStep: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'current_step',
      validate: {
        min: 0,
        max: 10,
      },
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_completed',
    },
    lastAccessed: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'last_accessed',
    },
  }, {
    tableName: 'user_progress',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'lesson_id'],
      },
    ],
  });

  return UserProgress;
};
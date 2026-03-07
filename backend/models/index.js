// models/index.js
const sequelize = require('../config/database');

// Импорт моделей
const UserModel = require('./User');
const LessonModel = require('./Lesson');
const UserProgressModel = require('./UserProgress');
const QuizResultModel = require('./QuizResult');

// Инициализация моделей
const User = UserModel(sequelize);
const Lesson = LessonModel(sequelize);
const UserProgress = UserProgressModel(sequelize);
const QuizResult = QuizResultModel(sequelize);

// Ассоциации
// User -> UserProgress (один ко многим)
User.hasMany(UserProgress, { foreignKey: 'user_id' });
UserProgress.belongsTo(User, { foreignKey: 'user_id' });

// User -> QuizResult (один ко многим)
User.hasMany(QuizResult, { foreignKey: 'user_id' });
QuizResult.belongsTo(User, { foreignKey: 'user_id' });

// Lesson -> UserProgress (один ко многим)
Lesson.hasMany(UserProgress, { foreignKey: 'lesson_id' });
UserProgress.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// Lesson -> QuizResult (один ко многим)
Lesson.hasMany(QuizResult, { foreignKey: 'lesson_id' });
QuizResult.belongsTo(Lesson, { foreignKey: 'lesson_id' });

// UserProgress и QuizResult не связаны напрямую между собой,
// но могут быть объединены через User и Lesson при необходимости

module.exports = {
  sequelize,
  User,
  Lesson,
  UserProgress,
  QuizResult,
};

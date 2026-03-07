require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const { authenticateToken, checkAdmin } = require('./middleware/auth');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const lessonController = require('./controllers/lessonController');
const userProgressController = require('./controllers/userProgressController');
const quizResultController = require('./controllers/quizResultController');

const app = express();
const PORT = Number(process.env.PORT || 3001);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

app.get('/users/me', authenticateToken, userController.getProfile);
app.get('/users', authenticateToken, checkAdmin, userController.getAllUsers);
app.patch('/users/:id', authenticateToken, userController.updateUser);
app.delete('/users/:id', authenticateToken, userController.deleteUser);

app.get('/lessons', authenticateToken, lessonController.getAllLessons);
app.get('/lessons/progress', authenticateToken, lessonController.getUserProgress);
app.get('/lessons/:slug', authenticateToken, lessonController.getLessonBySlug);
app.patch('/lessons/:slug/progress', authenticateToken, lessonController.updateProgress);
app.post('/admin/lessons', authenticateToken, checkAdmin, lessonController.createLesson);
app.patch('/admin/lessons/:id', authenticateToken, checkAdmin, lessonController.updateLesson);
app.delete('/admin/lessons/:id', authenticateToken, checkAdmin, lessonController.deleteLesson);

app.get('/progress', authenticateToken, userProgressController.getMyProgress);
app.post('/progress', authenticateToken, userProgressController.upsertProgress);

app.get('/quiz-results', authenticateToken, quizResultController.getMyQuizResults);
app.post('/quiz-results', authenticateToken, quizResultController.createQuizResult);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

async function start() {
  try {
    await sequelize.authenticate();
    const shouldSync = process.env.DB_SYNC === 'true';
    if (shouldSync) {
      await sequelize.sync();
    }

    app.listen(PORT, () => {
      console.log(`Backend API started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start backend:', err);
    process.exit(1);
  }
}

start();

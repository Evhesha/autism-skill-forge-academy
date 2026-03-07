const { Lesson, UserProgress } = require('../models');

// Получить все уроки
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      order: [['order', 'ASC']],
      attributes: ['id', 'title', 'slug', 'isFree', 'order', 'description']
    });

    const lessonsWithAccess = lessons.map(lesson => ({
      ...lesson.toJSON(),
      hasAccess: lesson.isFree || req.user.isSubscribed
    }));

    res.json(lessonsWithAccess);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить урок по slug
exports.getLessonBySlug = async (req, res) => {
  const { slug } = req.params;
  
  try {
    const lesson = await Lesson.findOne({ where: { slug } });

    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    if (!lesson.isFree && !req.user.isSubscribed) {
      return res.status(403).json({ 
        error: 'Урок доступен только по подписке',
        requiresSubscription: true
      });
    }

    const progress = await UserProgress.findOne({
      where: {
        userId: req.user.id,
        lessonId: lesson.id
      }
    });

    res.json({
      ...lesson.toJSON(),
      progress: progress || { currentStep: 0, isCompleted: false }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Обновить прогресс
exports.updateProgress = async (req, res) => {
  const { slug } = req.params;
  const { currentStep, isCompleted } = req.body;

  try {
    const lesson = await Lesson.findOne({ where: { slug } });
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    const [progress] = await UserProgress.findOrCreate({
      where: {
        userId: req.user.id,
        lessonId: lesson.id
      },
      defaults: {
        currentStep: 0,
        isCompleted: false
      }
    });

    await progress.update({
      currentStep: currentStep ?? progress.currentStep,
      isCompleted: isCompleted ?? progress.isCompleted,
      lastAccessed: new Date()
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Получить прогресс пользователя
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Lesson,
        attributes: ['id', 'title', 'slug', 'order']
      }]
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Админ: создать урок
exports.createLesson = async (req, res) => {
  const { title, slug, description, isFree, order, content } = req.body;

  try {
    const lesson = await Lesson.create({
      title,
      slug,
      description,
      isFree: isFree || false,
      order,
      content: content || []
    });

    res.status(201).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Админ: обновить урок
exports.updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, isFree, order, content } = req.body;

  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    await lesson.update({
      title, slug, description, isFree, order, content
    });

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Админ: удалить урок
exports.deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    await UserProgress.destroy({ where: { lessonId: id } });
    await lesson.destroy();

    res.json({ message: 'Урок удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
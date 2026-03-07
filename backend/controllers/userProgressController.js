const { UserProgress, Lesson } = require('../models');

exports.getMyProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.user.id },
      include: [{ model: Lesson, attributes: ['id', 'title', 'slug', 'order'] }],
      order: [['lastAccessed', 'DESC']],
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.upsertProgress = async (req, res) => {
  const { lessonId, currentStep = 0, isCompleted = false } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: 'Поле lessonId обязательно' });
  }

  try {
    const [progress] = await UserProgress.findOrCreate({
      where: { userId: req.user.id, lessonId },
      defaults: { currentStep, isCompleted, lastAccessed: new Date() },
    });

    await progress.update({
      currentStep,
      isCompleted,
      lastAccessed: new Date(),
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

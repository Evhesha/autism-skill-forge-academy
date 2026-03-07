const { QuizResult, Lesson } = require('../models');

exports.getMyQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.findAll({
      where: { userId: req.user.id },
      include: [{ model: Lesson, attributes: ['id', 'title', 'slug'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.createQuizResult = async (req, res) => {
  const { lessonId, score, answers = [] } = req.body;

  if (!lessonId || score === undefined) {
    return res.status(400).json({ error: 'Поля lessonId и score обязательны' });
  }

  try {
    const result = await QuizResult.create({
      userId: req.user.id,
      lessonId,
      score,
      answers,
    });

    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map((e) => e.message) });
    }

    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

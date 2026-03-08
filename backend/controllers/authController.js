const { User } = require('../models');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

// Регистрация
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Поля name, email и password обязательны' });
  }

  try {
    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isSubscribed: user.isSubscribed,
      subscriptionTier: user.subscriptionTier,
      createdAt: user.createdAt,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Вход в аккаунт
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isSubscribed: user.isSubscribed,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const cookieOptions = {
      // Allow frontend JS to read cookie (requested behavior).
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie('token', token, cookieOptions);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSubscribed: user.isSubscribed,
        subscriptionTier: user.subscriptionTier,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Выход из аккаунта
exports.logout = (req, res) => {
  res.clearCookie('token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: 'Выход выполнен' });
};

const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const router = Router();
console.log(module);


// Обработка post-запросов
// /api/auth/register, 2 параметром передается функция с логикой работы
router.post(
  '/register',
  // валидация данных
  [ 
    check('email', 'wrong email').isEmail(),
    check('password', 'minimal length 6 symbols').isLength({min: 6})
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request); // процесс валидации

      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: 'empty data at registration'
        })
      }

      const {email, password} = request.body; // request - объект запроса, то что отправляется с фронта

      // проверка существуюего пользователя при регистрации
      const candidate = await User.findOne({email}) // поиск в модели
      if (candidate) {
        return response.status(400).json({message: 'this user already exists'})
      }

      // регистрация пользователя
      const hashedPassword = await bcrypt.hash(password, 12); // хеширование пароля
      const user = new User({email, password: hashedPassword});
      await user.save();
      response.status(201).json({message: 'user is created'})

    } catch(e) {
      response.status(500).json({message: 'something is wrong, try again'});
    }
  })

// /api/auth/login, 2 параметром передается функция с логикой работы
router.post(
  '/login', 
  [
    check('email', 'type correct email').normalizeEmail().isEmail(),
    check('password', 'type password').exists()
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request); // процесс валидации

      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: 'empty data at loginning'
        })
      }

      // проверка данных при входе
      const {email, password} = request.body
      const user = await User.findOne({email});

      if (!user) {
        return response.status(400).json('user is not found')
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({message: 'wrong password, pls try again'})
      }

      // вход в систему
      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      )

      response.json({token, userId:user.id})

    } catch(e) {
      response.status(500).json({message: 'something is wrong, try again'});
    }
  })

// экспорт роутера
module.exports = router;
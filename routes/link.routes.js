const {Router} = require('express');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware'); // middleware
const config = require('config');
const shortid = require('shortid');
const router = Router();

router.post('/generate', auth, async (request, response) => {
  try {
    const baseUrl = config.get('baseUrl');
    const {from} = request.body // путь, откуда идет ссылка

    const code = shortid.generate();
    const isExisting = await Link.findOne({from});

    if (isExisting) {
      return response.json({link: isExisting});
    }

    // формирование сокращенной ссылки
    const to = baseUrl + '/t/' + code;
    const link = new Link({
      code, to, from, owner: request.user.userId
    });
    await link.save();

    response.status(201).json({link})
  } catch(e) {
    response.status(500).json({message: 'something is wrong, try again'});
  }
});

// получение всех ссылок
router.get('/', auth, async (request, response) => {
  try {
    const links = await Link.find({owner: request.user.userId}) // поиск всех ссылок из модели, которые относятся к текущему пользователю . find() - метод mongoose
    response.json(links);
  } catch(e) {
    response.status(500).json({message: 'something is wrong, try again'});
  }
});

// получение ссылок по id
router.get('/:id', auth, async (request, response) => {
  try {
    const link = await Link.findById(request.params.id) // все ссылки из модели, которые относятся к текущему пользователю
    response.json(link);
  } catch(e) {
    response.status(500).json({message: 'something is wrong, try again'});
  }
})

module.exports = router;
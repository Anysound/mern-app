const {Router} = require('express');
const router = Router();
const Link = require('../models/Link');

router.get('/:code', async (request, response) => {
  try {
    const link = await Link.findOne({code: request.params.code}); // получение нужной ссылки

    if (link) {
      link.clicks++ ; // подсчет кликов
      await link.save();
      return response.redirect(link.from) // переадресация, в качестве параметра указывается url, на который идет редирект
    }

    response.status(404).json('link not found') // установка статуса ответа и отправка в json формате

  } catch(e) {
    response.status(500).json({message: 'something \'s wrong, try again'})
  }
})

module.exports = router;
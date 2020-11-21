const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (request, response, next) => { // 3 параметра: запрос, ответ, метод, выполнящий продолжение запроса
  if (request.method === 'OPTIONS') { // проверка доступности сервера
    return next();
  }

  try {
    const token = request.headers.authorization.split(' ')[1]; // "bearer TOKEN"

    if (!token) { // если нет токена
      return response.status(401).json({message: 'no authorization'});
    }

    const decoded = jwt.verify(token, config.get('jwtSecret')); // раскодирование токена; 1 параметр - токен, 2 - секретный ключ
    request.user = decoded;
    next();
  } catch(e) {
    return response.status(401).json({message: 'no authorization'});
  }
}
const express = require('express'); // express - node.js framework
const config = require('config');
const mongoose = require('mongoose'); // mongoDB framework
const path = require('path');

const app = express();
app.use(express.json({extended: true})) // middleware json, обрабатывает json payloads - инфу с данными авторизации

// регистрация роута
app.use('/api/auth', require('./routes/auth.routes')); // первый параметр: урл, 2 параметр: сам роут
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') { // если настройки Production, отдаем статику
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname), 'client', 'build', 'index.html');
  })
}

const PORT = config.get('port') || 5000;

async function start() {
  try {
    // подключение к бд
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch(e) {
    console.log('server error: ', e.message);
    process.exit();
  }
}

start();

app.listen(PORT, () => console.log(`app has been started on port ${PORT} !`));
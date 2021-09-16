const express = require('express');
const mustacheExpress = require('mustache-express');

const backend = require('./backend');

backend.migrateDatabase()
  .then(() => {
    console.log('Database migration success');
  });

const port = 8080

const app = express()
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
  const users = await backend.readRows('user');
  console.log(users)

  res.render('index', {
    hasUsers: users.length > 0,
    users,
  });
})

app.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Hello user! ${userId}`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

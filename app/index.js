const express = require('express');
const mustacheExpress = require('mustache-express');

const backend = require('./backend');

backend.migrateDatabase()
  .then(() => {
    console.log('Database migration success');
  });

const port = 8080

const app = express()
app.use(express.urlencoded({ extended: true }))

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
  const users = await backend.getUsers();

  res.render('index', {
    hasUsers: users.length > 0,
    users,
  });
})

app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(404).send('not found');
    return;
  }

  const user = await backend.getUser(userId);
  const entries = await backend.getEntries(userId);

  const displayEntries = entries.map((entry) => {
    return {
      ...entry,
      date: formatDate(entry.date),
      amount: formatMoney(entry.amount),
    };
  });

  res.render('user', {
    user,
    entries: displayEntries,
  });
})

app.post('/user', async (req, res) => {
  const name = req.body.name;
  const status = req.body.status;

  if (!name) {
    res.status(400).send('bad request');
    return;
  }

  await backend.addUser(name, status);

  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function formatDate(date) {
  return new Date(date).toUTCString();
}

function formatMoney(amount) {
  return `£${amount}`;
}

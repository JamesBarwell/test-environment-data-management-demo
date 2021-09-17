const db = require('./db');

async function getUsers() {
  const connection = await db.getDatabase();
  const rows = await connection.all("SELECT * FROM user");
  return rows;
}

async function getUser(userId) {
  const connection = await db.getDatabase();
  const rows = await connection.all(`SELECT * FROM user WHERE id = ${userId}`);
  return rows[0];
}

async function addUser(name, status) {
  const connection = await getDatabase();
  const stmt = await connection.prepare(`INSERT INTO user (name, status) VALUES (?, ?)`);
  await stmt.run([name, status]);
  await stmt.finalize();
}

module.exports = {
  migrateDatabase: db.migrateDatabase,
  close: db.close,
  getUsers,
  getUser,
  addUser,
}

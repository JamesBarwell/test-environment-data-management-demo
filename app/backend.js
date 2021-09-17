const sqlite3 = require('sqlite3').verbose();
const open = require('sqlite').open;

let db;

async function openDatabase() {
  db = await open({
    filename: '../database/db.sqlite',
    driver: sqlite3.Database
  })
  return db;
}

async function getDatabase() {
  if (!db) {
    await openDatabase();
  }
  return db;
}

async function migrateDatabase() {
  const db = await getDatabase();
  await db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, status TEXT)");
}

async function close() {
  const db = await getDatabase();
  await db.close();
}

async function getUsers() {
  const db = await getDatabase();
  const rows = await db.all("SELECT * FROM user");
  return rows;
}

async function getUser(userId) {
  const db = await getDatabase();
  const rows = await db.all(`SELECT * FROM user WHERE id = ${userId}`);
  return rows[0];
}

async function addUser(name, status) {
  const db = await getDatabase();
  const stmt = await db.prepare(`INSERT INTO user (name, status) VALUES (?, ?)`);
  await stmt.run([name, status]);
  await stmt.finalize();
}

module.exports = {
  migrateDatabase,
  close,
  getUsers,
  getUser,
  addUser,
}

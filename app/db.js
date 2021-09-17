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

module.exports = {
  getDatabase,
  migrateDatabase,
  close,
}

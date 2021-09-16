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
  await db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER, name TEXT, status TEXT)");
}

async function countRows(tableName) {
  const db = await getDatabase();
  const rowsCount = await db.get(`SELECT count(*) count FROM ${tableName}`);
  return rowsCount.count;
}

async function readRows(tableName) {
  const db = await getDatabase();
  const rows = await db.all(`SELECT * FROM ${tableName}`);
  return rows;
}

async function writeTableRow(tableName, values) {
  const db = await getDatabase();
  const paramTokens = Array(values.length).fill('?');
  const stmt = await db.prepare(`INSERT INTO ${tableName} VALUES (${paramTokens})`);
  await stmt.run(values);
  await stmt.finalize();
}

async function close() {
  const db = await getDatabase();
  await db.close();
}

module.exports = {
  migrateDatabase,
  readRows,
  writeTableRow,
  close,
}

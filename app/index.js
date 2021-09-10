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

async function migrateDatabase() {
  await db.run("CREATE TABLE IF NOT EXISTS test (info TEXT)");
}

async function countRows(tableName) {
  const rowsCount = await db.get(`SELECT count(*) count FROM ${tableName}`);
  return rowsCount.count;
}

async function readRows(tableName) {
  const rows = await db.all(`SELECT * FROM ${tableName}`);
  return rows;
}

async function writeTableRow(tableName, values) {
  const paramTokens = Array(values.length).fill('?');
  const stmt = await db.prepare(`INSERT INTO ${tableName} VALUES (${paramTokens})`);
  await stmt.run(values);
  await stmt.finalize();
}

(async () => {
  const db = await openDatabase();

  await migrateDatabase();

  const writeValue = (new Date()).toISOString();
  await writeTableRow('test', [writeValue]);
  const tableRows = await readRows('test');

  await db.close();

  console.log(tableRows);
})()



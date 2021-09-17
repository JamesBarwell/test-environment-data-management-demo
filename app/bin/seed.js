const db = require('../db');

const testData = require('../../test-data/main.json');

async function emptyDatabase() {
  const connection = await db.getDatabase();
  await connection.run("DELETE FROM user")
  await connection.run("DELETE FROM sqlite_sequence WHERE name='user';")
}

async function seed() {
  const connection = await db.getDatabase();

  // Users
  for (const user of testData.users) {
    const stmt = await connection.prepare(`INSERT INTO user (id, name, status) VALUES (?, ?, ?)`);
    await stmt.run([user.id, user.name, user.status]);
    await stmt.finalize();
  }

  // Entries
  for (const entry of testData.entries) {
    const stmt = await connection.prepare(`INSERT INTO entry (id, user_id, date, amount, details) VALUES (?, ?, ?, ?, ?)`);
    await stmt.run([entry.id, entry.userId, entry.date, entry.amount, entry.details]);
    await stmt.finalize();
  }
}

(async function main() {
  await db.migrateDatabase();
  await emptyDatabase();
  await seed();
  db.close();
})();

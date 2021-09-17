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
    const stmt = await connection.prepare(`INSERT INTO user (name, status) VALUES (?, ?)`);
    await stmt.run([user.name, user.status]);
    await stmt.finalize();
  }
}

(async function main() {
  await db.migrateDatabase();
  await emptyDatabase();
  await seed();
  db.close();
})();

const db = require('./backend/config/db');

async function test() {
  console.log('--- Initial Colors ---');
  let [colors] = await db.query('SELECT * FROM colors');
  console.log('Count:', colors.length);

  console.log('--- Inserting New Color ---');
  await db.query('INSERT INTO colors (name, hex_code) VALUES (?, ?)', ['Test Color', '#123456']);

  console.log('--- Colors After Insert ---');
  [colors] = await db.query('SELECT * FROM colors');
  console.log('Count:', colors.length);
  console.log('Last item:', colors[colors.length - 1]);

  if (colors.length > 6) {
    console.log('SUCCESS: Color persisted in memory.');
  } else {
    console.log('FAILURE: Color did NOT persist in memory.');
  }
}

test();

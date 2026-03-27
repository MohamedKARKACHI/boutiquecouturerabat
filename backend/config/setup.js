const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  let connection;
  if (process.env.JAWSDB_URL) {
    // On Heroku, JAWSDB_URL is provided and we don't need to create the database
    connection = await mysql.createConnection(process.env.JAWSDB_URL);
  } else {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    // 1. Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
  }
  
  try {
    // 2. Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('Database is empty. Running initialization script...');
      const sqlPath = path.join(__dirname, '..', 'init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Split SQL by semicolon, filtering out empty lines
      const queries = sql.split(/;\s*$/m).filter(q => q.trim());
      
      for (let query of queries) {
        if (query.trim()) {
          await connection.query(query);
        }
      }
      console.log('Database initialized successfully.');
    } else {
       console.log('Database already exists and contains tables.');
    }

  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    await connection.end();
  }
};

module.exports = setupDatabase;

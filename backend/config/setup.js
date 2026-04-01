const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  if (process.env.USE_MOCK_DB === 'true' || !process.env.DB_HOST) {
    console.log('[MockDB] Skipping database initialization...');
    return;
  }
  let connection;
  try {
    if (process.env.JAWSDB_URL) {
      connection = await mysql.createConnection(process.env.JAWSDB_URL);
    } else {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
      await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    }
    
    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    
    // Always check for new tables (Migration)
    const tableList = tables.map(t => Object.values(t)[0]);
    
    if (tables.length === 0) {
      console.log('Database is empty. Running initialization script...');
      const sqlPath = path.join(__dirname, '..', 'init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      const queries = sql.split(/;\s*$/m).filter(q => q.trim());
      for (let query of queries) {
        await connection.query(query);
      }
      console.log('Database initialized successfully.');
    }

    // Run migration if tables are missing or just to be safe
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_dynamic_tables.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('Running dynamic tables migration...');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const queries = sql.split(/;\s*$/m).filter(q => q.trim());
      for (let query of queries) {
        await connection.query(query);
      }
      console.log('Migration completed.');
    }

    // Ensure Admin User exists
    const [users] = await connection.query('SELECT * FROM users LIMIT 1');
    if (users.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Default admin user created (admin / admin123)');
    }

  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = setupDatabase;

// models/db.js
require('dotenv').config();  // Load environment variables

const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.SQL_PASSWORD,
  database: 'roommates',
});

module.exports = pool;

const mysql = require('mysql2/promise'); // Make sure to use 'promise' for async/await
require('dotenv').config();

// Create MySQL pool connection using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

module.exports = pool;

const mysql = require('mysql2/promise'); // Use promise for async/await
require('dotenv').config(); // Load environment variables from .env file

// Create MySQL pool connection using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,     // Use DB_HOST from .env
    user: process.env.DB_USER,     // Use DB_USER from .env
    password: process.env.DB_PASSWORD, // Use DB_PASSWORD from .env
    database: process.env.DB_NAME,  // Use DB_NAME from .env
    port: process.env.DB_PORT,      // Use DB_PORT from .env
});

// Export the pool
module.exports = pool;


const mysql = require('mysql2/promise');
require('dotenv').config(); // Make sure to load environment variables

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Adjust based on your SSL requirements
    },
});

module.exports = pool;



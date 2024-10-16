const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration function
const register = async (req, res) => {
    const { fullname, username, password } = req.body;  // Ensure 'fullname' matches the DB column

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await pool.query(
            'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)',
            [fullname, username, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login function
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists in the database
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );

        if (rows.length === 0) {
            // If no user is found, return an error
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // If the passwords don't match, return an error
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Return the token in the response
        res.json({ token });

    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};

// Delete user function
const deleteUser = async (req, res) => {
    const { user_id } = req.body;  // Expect the user_id from the request body

    try {
        // Check if the user exists by user_id
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            // If the user doesn't exist, return an error
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user from the database
        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};

// Export the functions
module.exports = { register, login, deleteUser };

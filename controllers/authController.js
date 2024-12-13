const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration function
const register = async (req, res) => {
    const { fullname, username, password } = req.body;

    if (!fullname || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await pool.query(
            'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)',
            [fullname, username, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed. Please try again.', details: err.message });
    }
};

// Login function
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete user function
const deleteUser = async (req, res) => {
    const { user_id } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users function (requires Bearer Token)
const getAllUsers = async (req, res) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header is missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the Bearer string

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch all users from the database
        const [users] = await pool.query('SELECT user_id, fullname, username FROM users');

        res.status(200).json({ users });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        res.status(500).json({ error: err.message });
    }
};

// Update user function
const updateUser = async (req, res) => {
    const { user_id, fullname, username, password } = req.body;

    // Check if all required fields are provided
    if (!user_id || !fullname || !username) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Fetch the user from the database
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = rows[0];

        // Optionally, hash the new password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;  // Update the password
        }

        // Update user fields
        user.fullname = fullname;
        user.username = username;

        // Save the updated user data to the database
        await pool.query(
            'UPDATE users SET fullname = ?, username = ?, password = ? WHERE user_id = ?',
            [user.fullname, user.username, user.password || user.password, user_id]
        );

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Error updating user', details: err.message });
    }
};

// Export the functions
module.exports = { register, login, deleteUser, getAllUsers, updateUser };

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Ensure the correct path for authRoutes

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Basic route for checking server status
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Use the authRoutes for user-related API endpoints
app.use('/api/user', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const { register, login, deleteUser, getAllUsers, updateUser } = require('../controllers/authController'); // Include updateUser
const router = express.Router();

// Existing routes
router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteUser);
router.get('/users', getAllUsers); // Route for getting all users

// New route for updating user information
router.post('/update', updateUser); // POST method for updating a user

module.exports = router;

const express = require('express');
const { register, login, deleteUser, getAllUsers } = require('../controllers/authController'); // Include getAllUsers
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteUser);
router.get('/users', getAllUsers); // Route for getting all users

module.exports = router;

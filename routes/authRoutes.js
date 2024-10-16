const express = require('express');
const { register, login, deleteUser } = require('../controllers/authController'); // Corrected import
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteUser);

module.exports = router;

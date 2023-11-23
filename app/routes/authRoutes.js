const express = require('express');

const router = express.Router();
const { registerSuperAdmin, loginUser } = require('../controllers/authController');

router.post('/register', registerSuperAdmin);
router.post('/login', loginUser);

module.exports = router;

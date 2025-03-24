const express = require('express');
const { register, login, getCurrentUser, logout } = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/curuser',protect,getCurrentUser);
router.post('/logout',protect,logout);

module.exports = router;

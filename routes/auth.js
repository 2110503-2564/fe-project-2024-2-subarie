const express = require('express');
const { register, login, getCurrentUser, logout, getAdmins, deleteAdmin } = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/curuser', protect, getCurrentUser);
router.post('/logout', protect, logout);
router.get('/admins', protect, authorize('admin'), getAdmins);
router.delete('/admins/:id', protect, authorize('admin'), deleteAdmin);

module.exports = router;
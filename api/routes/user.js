const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth')
const router = express.Router();


const UserController = require('../controllers/user')

router.post('/login', UserController.sign_in_user)
router.post('/signup', UserController.create_new_user)
router.get('/user-info', checkAuth, UserController.get_user_info)

module.exports = router;
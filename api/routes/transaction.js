const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth')
const router = express.Router();


const TransactionController = require('../controllers/transaction')

router.post('/', checkAuth, TransactionController.create_transactions)

module.exports = router;
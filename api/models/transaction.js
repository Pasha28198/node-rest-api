const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: Object.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    account_id_sender: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)
const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account_ammount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Account', accountSchema)
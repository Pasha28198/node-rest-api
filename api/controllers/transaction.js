const User = require('../models/user')
const Account = require('../models/account')

exports.create_transactions = (req, res, next) => {
    User
        .find({_id: req.userData.userId})
        .populate('account', '_id account_ammount')
        .exec()
        .then(user => {
            if(user[0].account.account_ammount < req.body.amount) {
                return res.status(416).json({
                    message: 'Не достаточно средств'
                })
            }
            
            Account
                .find({_id: req.body.account_id_sender})
                .exec()
                .then( acc => {
                    if(acc.length) {
                        return res.status(404).json({
                            message: 'Користувач з таким кошильком не існує'
                        })
                    }

                    res.status(200).json({message: 'transaction success'})
                })
                .catch(err => { if (err) {res.status(500).json({
                    message: 'Користувач з таким кошильком не існує'
                })
            } 
        })
        })
        .catch(err => { if (err) {res.status(500).json(err)} })
}
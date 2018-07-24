const User = require('../models/user')
const Account = require('../models/account')

exports.create_transactions = (req, res, next) => {

    Account
        .find({_id: req.body.account_id_sender})
        .exec()
        .then(result => {
            if(result.length < 1) {
                return res.status(400).json('user with this wallet not exist')
            }
            
            Account
                .find({userId: req.userData.userId})
                .exec()
                .then( result => {
                    if (result[0].account_ammount >= req.body.amount) {
                        const new_amount_user = result[0].account_ammount - req.body.amount
                        const new_amount_sender = result[0].account_ammount + req.body.amount

                        Account
                            .update(
                                {userId: req.userData.userId},
                                {$set: {account_ammount: new_amount_user}}
                            )
                            .exec()
                            .then( result => {
                                Account
                                    .update(
                                        {_id: req.body.account_id_sender},
                                        {$set: {account_ammount: new_amount_sender}}
                                    )
                                    .exec()
                                    .then(
                                        result => {
                                            res
                                                .status(200)
                                                .json({
                                                    message: "transaction success"
                                                })
                                            }
                                    )
                                    .catch(
                                        err => {
                                            if (err) {
                                                res.status(500).json({
                                                    err: err
                                                })
                                            }
                                        } 
                                    )

                            })
                            .catch(
                                err => {
                                    if (err) {
                                        res.status(500).json({
                                            err: err
                                        })
                                    }
                                } 
                            )
                            
                    } else {
                        res.status(400).json('Not valid data')
                    }
                })
                .catch(err => {
                    if (err) {
                        res.status(500).json({
                            err: err
                        })
                    }
                })
        })
        .catch(err => {
            if (err) {
                res.status(500).json({
                    err: err
                })
            }
        })
}
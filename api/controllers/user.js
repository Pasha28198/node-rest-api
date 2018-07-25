const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../models/user')
const Account = require('../models/account')


exports.sign_in_user = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if (!users.length) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            } else {
                bcrypt.compare(req.body.password, users[0].password, (error, result) => {
                    if(error) {
                        return res.status(500).json({error: error})
                    }
    
                    if(result) {
                        const token = jwt.sign({
                            email: req.body.email,
                            userId: users[0]._id
                        },
                        'secret',
                        {
                            expiresIn: "1h"
                        }
                    )
                        return res.status(200).json({
                            message: "Auth success",
                            token: token
                        })
                    } else {
                        res.status(401).json({message: "Auth failed"})
                    }
                })
            }
        })
        .then(error => {
            if (error) {
                res.status(500).json(error)
            }
        })
}

exports.create_new_user = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length) {
                res.status(409).json(
                    {
                        message: 'user exist'
                    }
                )
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({error: err});
                    } else {
                        const idUser = mongoose.Types.ObjectId();

                        const account = new Account({
                            _id: mongoose.Types.ObjectId(),
                            account_ammount: 1000,
                            userId: idUser
                        })

                        account
                            .save()
                            .then(result => {
                                const user = new User({
                                    _id: idUser,
                                    email: req.body.email,
                                    password: hash,
                                    account: result._id
                                })

                                user
                                    .save()
                                    .then(results => {
                                        res.status(200).json({message: "user created"})
                                    })
                                    .catch(error => {
                                        res.status(500).json(error)
                                    })
                            })
                            .catch(error => {res.status(500).json(error)})
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

exports.get_user_info = (req, res, next) => {
    User.find({_id: req.userData.userId})
        .populate('account', '_id account_ammount')
        .select('_id email account')
        .exec()
        .then( user => {
            res.status(200).json(
                user[0]
            )
        })
        .catch((error) => {
            if (error) {
                res.status(500).json(error)
            }
        })
}
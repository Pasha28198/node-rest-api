const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user')
const transactionRoutes = require('./api/routes/transaction')

mongoose.connect(
    "mongodb://admin:adminadmin@firstdb-shard-00-00-tc40f.mongodb.net:27017,firstdb-shard-00-01-tc40f.mongodb.net:27017,firstdb-shard-00-02-tc40f.mongodb.net:27017/test?ssl=true&replicaSet=firstDB-shard-0&authSource=admin&retryWrites=true"
)

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
})

app.use('/user', userRoutes)
app.use('/transaction', transactionRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;

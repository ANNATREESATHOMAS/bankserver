// connect mongodb to server
const mongoose = require('mongoose')


// connection string
mongoose.connect('mongodb://localhost:27017/BankServerDB', {
    useNewUrlParser: true
})

// model creation
const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction: []
})

// export model
module.exports = {
    User
}
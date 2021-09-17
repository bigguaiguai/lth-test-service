const mongoose = require('mongoose')

let usersSchema = new mongoose.Schema({
    userName: String,
    password: String,
    createTime: String,
    loginTime: String,
})

// 通过建 model 给 users 赋予增删改查等读写的功能
module.exports = mongoose.model('Users',usersSchema)
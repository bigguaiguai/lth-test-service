const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
    createTime: String,
    detail: { // 和person表中存的字段 要保持一致
        type: Schema.Types.ObjectId,
        ref: 'PersonDetail', //这里即为子表的外键，关联主表。
    }
})

module.exports = mongoose.model('Person',PersonSchema,'person')
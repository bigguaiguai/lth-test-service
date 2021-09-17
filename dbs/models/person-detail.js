const mongoose = require('mongoose')


let PersonDetailSchema = new mongoose.Schema({
    address: String,
    sex: {
        type: Number,
        default: 0,
    },
    tel:Number,
    weight: Number,
    height: Number,
    


})

module.exports = mongoose.model('PersonDetail',PersonDetailSchema,'personDetail')
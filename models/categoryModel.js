const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type: String,
    }
})

module.exports = mongoose.model('category', userSchema)
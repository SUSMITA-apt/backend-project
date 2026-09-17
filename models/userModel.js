const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    fristName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    //Billing Address
    billingAddress: {
        fristName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        state:{
            type: String,
            trim: true
        },
        country:{
            type: String,
        },
        zipcode: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        phone:{
            type: String,
            trim: true
        }
    },
    role:{
        type: String,
        enum: ['admin', 'user', 'editor'] ,
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userStatus: {
        type: String,
        enum: ['approved', 'reject', 'blocked'],
        default: 'approved'
    }
})

module.exports = mongoose.model('single_vendor_all_user', userSchema)
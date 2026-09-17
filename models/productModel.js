const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min: 0,
    },
    discundprice:{
        type: Number,
        required: true,
        min: 0
    },
    catagory:{
        type:String,
        required: true,
    },
    stock:{
        type: String,
        required: true,
        min: 0,
        default: 0
    },
    sku:{
        type: String,
        unique: true,
        sparse: true
    },
    images:[{
        url:{
            type:String,
            required: true 
        },
        ismain:{
            type: Boolean,
            default: false,
        }
    }],
    status:{
        type: String,
        enum: ['pandding', 'active', 'inactive'],
        default: 'pandding'
    },
    tags:[String],
    weight: Number,
    slug:{
        type: String,
        unique: true,
        lowercase: true
    },
},{timestamps:true})

// indexing this product
productSchema.index({title: 'text', description: 'text'})
productSchema.index({status: 1})

module.exports = productSchema

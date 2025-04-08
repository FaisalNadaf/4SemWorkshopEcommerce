const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        
    },
    brand:{
        type:String,
       
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
})


const Product = mongoose.model('Product',productSchema);
module.exports = {Product};
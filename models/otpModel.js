const mongoose = require("mongoose");

const otpSchema =    mongoose.Schema({
      email:{
        type:String,
        unique:true,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
        length:6
    }
},{timestamps:true});


const Otp = mongoose.model("otp",otpSchema)

module.exports = Otp;


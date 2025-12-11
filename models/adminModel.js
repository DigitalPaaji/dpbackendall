const mongoose = require("mongoose");

const adminSchema=  mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
         type:String,
        required:true, 
    }
},{timestamps:true});


const Admin = mongoose.model("admin",adminSchema);

module.exports  = Admin;



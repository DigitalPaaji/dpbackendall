const mongoose  = require("mongoose");


const contactSchema= mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    phone:{
         type:String,
        trim:true,
        required:true,
    },
    classname:{
         type:String,
        trim:true,
        required:true,
    },
    school:{
         type:String,
        trim:true,
        required:true,
    }
},{timestamps:true});


const Contact = mongoose.model("contact",contactSchema)

module.exports = Contact;



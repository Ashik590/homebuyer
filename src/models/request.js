const mongoose = require("../db/db");

const reqSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

const Request = new mongoose.model("Request",reqSchema)

module.exports = Request;
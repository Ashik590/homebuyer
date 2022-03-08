const mongoose = require("../db/db");

const bookingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    detail:[
        {
            type:Object,
            required:true
        }
    ]
});

const Booking = new mongoose.model("Booking",bookingSchema);

module.exports = Booking;
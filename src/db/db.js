const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://Ashik:${process.env.DB_PASS}@cluster0.y1bjv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
    useNewUrlParser:true, useUnifiedTopology:true,
}).then(()=>{
    console.log("Server connected with db");
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;
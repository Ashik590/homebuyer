require("dotenv").config()
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const path = require("path");

const port = 8443 || process.env.PORT;
const Booking = require("./models/booking");
const Request = require("./models/request");

app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"../build")));

app.get("/",(req,res)=>{
    res.render("index");
});


app.post("/do-booking",async(req,res)=>{
    try {
        const {info} = req.body;
        const {firstName,lastName,email,phone} = info[info.length - 1]
        const detail = info.filter((val,ind)=>{
            return ind !== info.length - 1;
        });
    
        const book = new Booking({
            name:`${firstName} ${lastName}`,
            email:email,
            phone:phone,
            detail:detail,
        });

        const result = await book.save();

        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false,
            port: 587,
            tls: {
               ciphers:'SSLv3'
            },
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let quess = "";
        detail.map((val)=>{

            quess += 
                `<div class="d-flex justify-content-between">
                    <b>${val.ques}</b>
                    <span>${val.ans}</span>
                </div>`
        })

        quess = quess.replace(",","")

        const content = `
        <html lang="en">
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <style>
            .main{
                padding: 0 20px;
                max-width:450px;
                margin:auto;
            }
            h1{
                text-align:center;
                margin-bottom:20px;
                font-weight: bold;
            }
            b{
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <h1>Homebuyer Assistant Order</h1>
        <div class="main">
            <div>
              <div class="d-flex">
                <b>Name :</b>
                <span class="ms-2">${firstName} ${lastName}</span>
              </div>
              <div class="d-flex">
                <b>Phone :</b>
                <span class="ms-2">${phone}</span>
              </div>
              <div class="d-flex">
                <b>Email :</b>
                <span class="ms-2">${email}</span>
              </div>
              </div>
              <hr>
              <div>
                ${quess}
              </div>
          </div>
    </body>
    </html>
        `

        const options = {
            from:'"Homebuyer Assistant" <no-reply.homebuyer@hotmail.com>',
            to:"info@yourhomebuyerassistance.com",
            subject:"Homebuyer Assistant Notification",
            html:content
        };

        transporter.sendMail(options,(err,info)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Message has been sent",info.response);
            }
        })


        res.send("okay")
        
    } catch (error) {
        console.log(error);
    }
});

app.post("/request-call",async(req,res)=>{
    try {
        const {name,email,phone} = req.body.form;
        const request = new Request({
            name,phone,email
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:{
                user:"azizulhakimashik0188@gmail.com",
                pass:"01991393572abc",
            }
        });

        const content = `
        <html lang="en">
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <style>
            .main{
                padding: 0 20px;
                max-width:450px;
                margin:auto;
            }
            h1{
                text-align:center;
                margin-bottom:20px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>Request for a call from Homebuyer Assistant</h1>
        <div class="main">
            <div>
              <div class="d-flex">
                <b>Name :</b>
                <span class="ms-2">${name}</span>
              </div>
              <div class="d-flex">
                <b>Phone :</b>
                <span class="ms-2">${phone}</span>
              </div>
              <div class="d-flex">
                <b>Email :</b>
                <span class="ms-2">${email}</span>
              </div>
            </div>
          </div>
    </body>
    </html>
        `;

        const options = {
            from:'"Homebuyer Assistant" <azizulhakimashik0188@gmail.com>',
            to:"info@yourhomebuyerassistance.com",
            subject:"Homebuyer Assistant Notification",
            html:content
        };

        transporter.sendMail(options,(err,info)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Message has been sent",info.response);
            }
        })

        await request.save();

        res.send("okay")
    } catch (error) {
        console.log(error);
    }
})

app.listen(port,()=>{
    console.log("Server started at port",port);
})
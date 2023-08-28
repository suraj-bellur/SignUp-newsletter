//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import request from "request";
import https from "https";
import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName  
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/cbde54ce07";

    const options={
        method: "POST",
        auth: "suraj1:#a1e7d42a4f018c7dc995c879bfa4c373-us21"
    }

    const request=https.request(url, options, function(response){

        
        if(response.statusCode===200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || port,function(){
    console.log(`server running on port ${port}`);
});


//api key : a1e7d42a4f018c7dc995c879bfa4c373-us21

//audience id : cbde54ce07
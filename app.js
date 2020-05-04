//jshint esversion:6
// we dont need constant for dotenv

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const app = express();
const encrypt=require("mongoose-encryption");
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
 
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});

const userSchema=mongoose.Schema({
    email:String,
    password:String,
});

//const encKey=process.env.SOME_64BYTE_BASE64_STRING; or just create your own

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password,
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundData){
        if(!err){
            if(foundData){
                if(foundData.password===password){
                    res.render("secrets");
                }
            }else{
                res.redirect("/login");
            }
        }else{
            console.log(err);
        }
    })
})

app.listen(3000,function(){
    console.log("Server launched on port 3000");
})
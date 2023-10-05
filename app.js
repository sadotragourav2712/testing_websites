//jshint esversion:6
require('dotenv').config();
const express=require('express');
const app=express();
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(()=>console.log("connnected to database"));
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});//plugin field should come before model
//and in encryptedFields we can just add more fields which we want to encrypt by ["password","username"]
const User=mongoose.model("User",userSchema);
app.get('/',(req,res)=>{
    res.render("home");
})


app.get('/login',(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async function(req,res){

    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
   const a=await newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>console.log(err,"err in register"));
})

app.post("/login",async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const a=await User.findOne({email:username}).then(function(foundUser){
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }

        }
}).catch((err)=>console.log(err,"There is an error in login"))
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})
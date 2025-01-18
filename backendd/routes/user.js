const router=require("express").Router();
const User=require('../models/user')
const bycrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
require("dotenv").config();

const { authenticateToken } = require("./auth");

router.post("/sign-in",async(req,res)=>{
    try{
    const {username}=req.body;
    const {email}=req.body;
    const existingUser=await User.findOne({username:username})
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }else if(username.length<3){
        return res.status(400)
        .json({message:"Username must be at least 3 characters long"})
    }
    const existingEmail=await User.findOne({email:email})
    if(existingEmail){
        return res.status(400).json({message:"Email already exists"})
    }
    const hashPass= await bycrypt.hash(req.body.password, 10);
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPass
    });
    await newUser.save();
    return res.status(200).json({message:"SignUp Successfully"})
    }catch(err){
        console.log(err);
        return res.status(400).json({message:"Internal Server Error"})
        
    }
})

router.post("/log-in",async(req,res)=>{
    const {username,password}=req.body;
    const existingUser=await User.findOne({username:username})

    console.log("EXISTING"+existingUser);
    
    if(!existingUser){
        return res.status(400).json({message:"Invalid Credentials"})
    }
    bycrypt.compare(password,existingUser.password,(err, data)=>{
        if(data){
            const authClaims=[{name:username},{jti:jwt.sign({},"SECRETKEY")}];
            const token=jwt.sign({authClaims},"SECRETKEY",{expiresIn:"2d"});
            res.status(200).json({id:existingUser._id,token:token})


        } else{
            return res.status(400)
            .json({message:"Invalid Credentials"})
        }
    })
})

router.get("/get-user-detail", authenticateToken, async (req, res) => {
    try {
        const { _id } = req.headers; // Access _id from headers
        if (!_id) {
            return res.status(400).json({ message: "User ID not provided in headers" });
        }

        // Assuming you have a valid `username` in `req.user` or in the database
        const user = await User.findById(_id); // Find user by id

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const authClaims = [
            { name: user.username }, // Assuming `user.username` exists in the database
            { jti: jwt.sign({}, "SECRETKEY") }
        ];

        const token = jwt.sign({ authClaims }, "SECRETKEY", { expiresIn: "2d" }); // JWT with the claims

        res.status(200).json({ result: user, message: "User Details Retrieved", token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports= router;
const mongoose=require('mongoose');
require("dotenv").config();
const conn=async()=>{
try{
    const response=await mongoose.connect(`${process.env.MONGO_URI}`);
    if(response){
        console.log("DB Connected");
    }
}catch(err){
    console.log(err);
    
}
}
conn();
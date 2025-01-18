const mongoose=require("mongoose");
const useSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
        password:{
        type:String,
         required:true
    },
    task:[
        {
            type:mongoose.Types.ObjectId,
            ref:"tasks"
        }
    ],

})
module.exports=mongoose.model("User",useSchema)
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
require("dotenv").config();
require('./conn/db')
const cors=require("cors")
const UserAPI=require('./routes/user')
const TaskAPI=require('./routes/task')
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());

app.use("/api/v1",UserAPI);
app.use("/api/v2",TaskAPI);
// app.use("/",(req,res)=>{
//     res.send("Hello World");
// });
const PORT=3001
app.listen(PORT,()=>{
    console.log("Server Started");
    
})
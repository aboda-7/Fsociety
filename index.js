const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.router');
const httpStatusCode = require('./utils/http.status');


const app = express();
app.use(express.json());
const URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log('server is up');
})

mongoose.connect(URL).then(() =>{
    console.log("connected to database");
})

app.use('/users',usersRouter);
app.use('*',(req,res)=>{
    res.status(404).json({status : httpStatusCode.Error ,
         data : {message : "this resource is not found"}});
})



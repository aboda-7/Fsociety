const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.router');
const httpStatusCode = require('./utils/http.status');
const cors = require('cors');
const app = express();

<<<<<<< HEAD
=======
const app = express();
>>>>>>> 6394320c28fba94bc2e51899cd90b34d94908862
app.use(cors());
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

//gloabl not found handler
app.use('*',(req,res)=>{
    res.status(404).json({status : httpStatusCode.Error ,
         data : {message : "this resource is not found"}});
})


//global error handler
app.use((error, req, res, next) => {  
    if(error.name === "ValidationError"){
        error.statusMessage = httpStatusCode.Error;
        error.statusCode = 400;
        error.message = "Invalid email format";
    }
    res.status(error.statusCode || 400).json({
        status: error.statusMessage,
        data: { message: error.message }
    });
});


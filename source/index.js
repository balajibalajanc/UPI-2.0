const express=require('express');
require('./db/mongoose');
const { response, request } = require('express');
const userRouter=require('./routers/user_router');
const accountRouter=require('./routers/account_router');

const app=express()
const port=process.env.PORT || 3000

app.use(express.json());
app.use(userRouter);
app.use(accountRouter);

app.get("/user/",(request,response)=>{
    response.send(' Main Page status: Page under Construction')
})


app.listen(port,()=>{
    console.log('sever is up and running in '+ port );
    })  
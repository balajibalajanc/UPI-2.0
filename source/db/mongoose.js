const mongoose=require('mongoose');
// const validator= require('validator');
mongoose.connect("mongodb://127.0.0.1:27017/UPI-two-zero",{
useNewUrlParser:true,   
useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
}).then((result)=>
{console.log("Database connected Successfully");}).catch((reject)=>{
    console.log(reject);
})

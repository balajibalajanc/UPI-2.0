const mongoose=require('mongoose');
const validator= require('validator');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const Account= require('../models/account')
const multer=require('multer');

// mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api",{
// useNewUrlParser:true,   
// useUnifiedTopology: true,
//     useCreateIndex: true
// }).then((result)=>
// {console.log("Database connected Successfully");}).catch((reject)=>{
//     console.log(reject);
// })
const Userschema= new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim:true

    },
    user_name:{
        unique:true,
        type:String,
        required: true,
        trim:true,
        lowercase:true,
        

    },

    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw new error("Am i joke to you give a proper password");   
               }
        }
    },
    tokens: [{
        token: {
            required:true,
            type: String
        }
    }],avatar:{
        type:Buffer
    }
    
},{
    timestamps:true
})

Userschema.virtual('accounts',{
    ref:'Account',
    localField:'_id',
    foreignField:'owner'

})

Userschema.methods.toJSON= function()
{
    const user=this
    const userObject= user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

Userschema.methods.generateAuthToken =async function (){
    const user=this;
    const token=jwt.sign({_id: user._id.toString()},'thisismynewtry' )
    user.tokens=user.tokens.concat({token});
    await user.save()
    return token

} 

Userschema.statics.findByCredentials = async (user_name,password)=>{
    const user= await User.findOne({user_name});
    if(!user)
    {
        throw new Error ('Unable to login ...mail is not there')
    }
    const isMatching= await bcrypt.compare(password,user.password);

    if(!isMatching)
    {
        throw new Error ('Unable to login ...password is not matching')
    }

    return user

}

Userschema.pre('save',async function(next){
    const user=this
if(user.isModified('password'))
{
    user.password=await bcrypt.hash(user.password,8);
}
    next()
})

Userschema.pre('remove', async function(next){
const user=this
await Account.deleteMany({owner:user._id});
next();
})

//Model for Users
const User= mongoose.model('User',Userschema)

module.exports=User;
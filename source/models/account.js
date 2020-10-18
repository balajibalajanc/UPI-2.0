//Model for task
const mongoose=require('mongoose');
const bcrypt= require('bcrypt');

const accountSchema= mongoose.Schema({
    Date:{
        type:Date,
        trim:true,
    },
    Description:{
        type:String,
        trim:true
    },  
    withdraw:{
        type:Number,
        default:0,
        trim:true,
    },
    deposit:{ 
         type:Number,
        default:0,
        trim:true,
    },
    Closing_Balance:{ 
        type:Number,
    trim:true,
    validate(value){
        if(!value >= 1000){
            throw new Error("Minimum balance should be 1000");
        }
    }
},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

accountSchema.pre('save',async function(next){
    const acount=this

    next()
})


const Account= mongoose.model('Account',accountSchema);



module.exports=Account;

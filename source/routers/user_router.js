const express=require('express');
const User=require('../models/user');
const auth=require('../middle_ware/auth');
const { request, response } = require('express');
const router=new express.Router();
const multer=require('multer');

//Create User
router.post('/users', async (request,response)=>{
    const user=new User(request.body);
try {
    await user.save();
    const token= await user.generateAuthToken();
    response.status(201).send({ user,token });
}catch(e){
    response.status(400).send(e)
}})

//login User
router.post('/users/login',async (request,response)=>{
    try{
     const user = await User.findByCredentials(request.body.user_name,request.body.password);
     const token= await user.generateAuthToken();
     response.send({user,token});
    }
    catch(e){
     response.status(400).send('There is no such profile');
    } 
 })

 //logout
 router.post('/users/logout',auth,async (request,response)=>{
    try{

        request.user.tokens=request.user.tokens.filter((token)=>{
           return token.token !== request.token
        })
        await request.user.save();
        response.send();
    }catch(e){
        response.status(500).send(e)
    }
})

//logout
router.post('/users/logoutall',auth,async (request,response)=>{
    try{
                request.user.tokens= [];
        await request.user.save();
        response.send();
    }catch(e){
        response.status(500).send(e)
    }
})

//read_profile
router.get('/users/me', auth,async (request,response)=>{
    response.send(request.user);
    
        //     try{
    //        // console.log('all user');
    //    const user= await User.find({})
    //      response.send(user).status(200)
    //     }catch(e){
    //  response.statut(400).send(e);
    //     }
     //     User.find({}).then((user)=>{
     // response.send(user)
     //     }).catch((error)=>{
     // response.send(error)
     //     })
     })

//delete user account
     router.delete('/users/me',auth, async (request,response)=>{
 
        try{
           //  const user= await User.findByIdAndDelete(request.params.id)
    
           //  if(!user)
           //  {
           //      return response.status(404).send("It is not in the search")
           //  }
   
           await request.user.remove()
            response.status(200).send({User:request.user,Message:"Item delete successfully"})
        }
        catch(e){
            response.status(400).send(e)
        }
    }) 


    //including a csv document
 const avatar =multer({
    limits: {
        fileSize:1000000 //filter the csv document size to utilize the storage properly
    },
    fileFilter(request,file,cb){
        if(!file.originalname.match(/\.(csv$|xlsx$|xls$)/))
    {
        return cb(new Error("Please provide a proper file"))
    }
     cb (undefined,true);

    }
})
router.post('/users/me/avatar',auth ,avatar.single('avatars'), async(req,res) => {
    req.user.avatar=req.file.buffer;
    await req.user.save();
    res.status(200).send("csv saved successfully");
},(error,req,res,next)=> {
    res.send(error.message)
})

    module.exports=router
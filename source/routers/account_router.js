const express=require('express');
const Account=require('../models/account');
const auth=require('../middle_ware/auth');
const { update } = require('../models/account');
const router=new express.Router();


//create the new account_details
router.post("/account-status",auth, async (request,response)=>{
   
 const account=new Account({
     ...request.body,
     owner:request.user._id
 })
     try{
         await account.save()
          response.send(account).status(200)           
     }catch(e){
         response.status(400).send(e);
     }

    })

    //return the account _details
    router.get('/account-status',auth, async (request,response)=>{
    
        try{
        
        await request.user.populate({
            path:'accounts'            
        }).execPopulate();
       const flas=(request.user.accounts).length;
        if (flas === 0)
        {
            return response.status(404).send("There is no account details Please upload a CSV file to proceed please go ahead and upload your profile in the /users/me/avatar")
        }
        response.send(request.user.accounts);
        }catch(e){
            response.send(error).status(400)
        }   

    })


    
    module.exports=router
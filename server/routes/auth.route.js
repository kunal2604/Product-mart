const userController=require('../controller/user.controller.js')
const express=require('express');
const asynHandler=require('express-async-handler');
const authController=require('../controller/auth.controller')

const router=express.Router();
const passport =require('../middleware/passport');

//localhost:4050/api/auth/register

// we added login as the third parameter as 'next' and the below requests will generate token for login
// and reistration by using login function

router.post("/register",asynHandler(insert),login);
router.post("/login",asynHandler(getUserByEmailAndPassword),login);
router.get("/findme",passport.authenticate("jwt", { session: false}), login);  //jwt is the strategy. 

async function insert(req,res,next){
    const user=req.body;
    console.log(`reistering user`,user);
    req.user = await userController.insert(user);  //saving original record of user details which inserted in DB to request body.
    next();
}

async function getUserByEmailAndPassword(req,res,next){
    const user=req.body;
    console.log(`searching user for`,user);
    const saveduser=await userController.getUserByEmailAndPassword(
        user.email,
        user.password
    );
    req.user=saveduser;     //saving original details of DB user into req.user
    next();
}

function login(req,res){
    const user=req.user;
    const token=authController.generateToken(user);
    res.json({
        user,
        token
    });
}

module.exports=router;

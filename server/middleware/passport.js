const passport = require('passport');
const LocalStrategy =require('passport-local');
const JwtStrategy =require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;

const config=require('../config/config');
const userController=require('../controller/user.controller');

const localLogin=new LocalStrategy(             // we use this function for first time login
    {
    usernameFeild:'email'
    },
    async (email,  password, done)=>{
        const user=userController.getUserByEmailAndPassword(email,password)
        return user
        ?done(null,user)
        :done(null,false,{
            error:'Yor login details are not valid, Please try again.'
        })
    }
)

const jwtLogin= new JwtStrategy(
    {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : config.jwtSecret
    },
    async(payload,done) =>  {
        const user=await userController.getUserById(payload._id);
        return user
        ?done(null,user)
        :done(null,false,{  
            error:'Yor login details are not valid, Please try again.'
        });
    }
);

module.exports=passport.use(localLogin).use(jwtLogin);

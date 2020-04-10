const express= require('express');
const authRoute= require('./auth.route');
const router= express.Router();

//localhost:4050/api/auth
router.use('/auth',authRoute);
module.exports= router;

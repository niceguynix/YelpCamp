const express = require('express');
const passport = require('passport');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync( async (req,res)=>{
    try{
    const {username , email , password} =req.body;
    const user = new User({username , email});  
    const registeredUser = await User.register(user,password);
    req.flash('success','Welcome to YelpCamp '+user.username);
    res.redirect('/campgrounds');
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!');
    res.redirect('/campgrounds');
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash(
        'success','Goodbye! Come back soon!'
    )
    res.redirect('/campgrounds');
});

module.exports = router;
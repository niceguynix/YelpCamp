const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema , reviewSchema } = require('./schemas');
const morgan = require('morgan');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//still using local database
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));
db.once("open",()=>{
    console.log('Database Connected');
});

const app = express();



app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.use(morgan('tiny'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'/public')));

const sessionConfig = {
    secret:'thisshoudbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res)=>{
    res.render('home');
})





app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})


app.use((err,req,res,next)=>{
    const {message='something went wrong',statusCode=500} = err;
    if(!err.message) err.message="Oh no Something went wrong";
    res.status(statusCode).render('error',{err});
})


app.listen(80,()=>{
    console.log("Started!");
})
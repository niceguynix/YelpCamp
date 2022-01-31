const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { campgroundSchema , reviewSchema } = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You need to be logged in to do that');
        return res.redirect('/login');
    }
    next(); 
};

module.exports.validateCampground = (req,res,next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg ,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.owner.equals(req.user._id)){
        req.flash('error','You are not the owner of this campground!');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg ,400)
    }
    else{
        next();
    }
}
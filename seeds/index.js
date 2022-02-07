const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');



mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));
db.once("open",()=>{
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000 ) + 1;
        const price = Math.floor(Math.random() * 20 ) + 1;
        const camp = new Campground({
            owner:'61f677999dcb18eeae5d1a02',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Generic description',
            price

        })
        await camp.save();
    }
}


seedDB()
    .then(()=>{
        db.close()
    });

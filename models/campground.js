const mongoose = require('mongoose');
const reviewSchema = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema =  new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await reviewSchema.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);
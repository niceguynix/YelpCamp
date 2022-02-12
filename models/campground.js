const mongoose = require('mongoose');
const reviewSchema = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    console.log('ho')
    return this.url.replace('/upload','/upload/w_200');
});

const CampgroundSchema =  new Schema({
    title:String,
    images:[
        ImageSchema
    ],
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
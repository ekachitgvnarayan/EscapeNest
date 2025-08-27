import mongoose from "mongoose";
import {Review} from "./review.js";

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        maxLength:1000
    },
    image:{
        url:{
            type:String
        },
        filename:{
            type:String
        }
    },
    price:{
        type:Number,
        min:1,
        required:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Review"
                }
            ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:pointSchema,
        required:true
    }
});

listingSchema.post("findOneAndDelete",async (data)=>{
    const delReviews=await Review.deleteMany({_id:{$in:data.reviews}});
    console.log("Printing from post middleware in listing.js");
    console.log(delReviews)
})

const Listing= mongoose.model("Listing",listingSchema);
export {Listing};
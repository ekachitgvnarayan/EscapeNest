import mongoose from "mongoose";

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
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
});

const Listing= mongoose.model("Listing",listingSchema);
export {Listing};
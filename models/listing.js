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
        type:String
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
    }
});

const Listing= mongoose.model("Listing",listingSchema);
export {Listing};
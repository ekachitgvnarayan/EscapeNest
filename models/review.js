import mongoose from "mongoose";


const  reviewSchema = new mongoose.Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        max:5,
        min:0
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
});

const Review = mongoose.model("Review",reviewSchema);
export {Review};
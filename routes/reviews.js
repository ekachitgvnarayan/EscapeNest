import express from "express";
const router =express.Router({mergeParams:true});
import mongoose from "mongoose";
import {asyncWrap} from "../utils/asyncWrap.js";
import {joiValidateReview} from "../utils/joiValidate.js";
import {Listing} from "../models/listing.js";
import {Review} from "../models/review.js";


router.post("/",joiValidateReview,asyncWrap(async (req,res,next)=>{
    console.log("working post req");
    const {id} = req.params;
    // console.log(id);
    const {review} = req.body;
    const reviewUpdate = await Review.insertOne({
        comment:review.comment,
        rating:review.rating
    });
    const review_id = reviewUpdate._id;
    console.log(reviewUpdate.createdAt);
    // console.log(review_id);
    const x = await Listing.findByIdAndUpdate(id,  {$push:{reviews:{$each:[review_id]}}}  ,{new:true}).populate("reviews");
     console.log(x);
     res.redirect(`/listings/${id}`);
}))

router.delete("/:reviewId",async(req,res,next)=>{
    let {id, reviewId} = req.params;
    const delReview = await Review.findByIdAndDelete(reviewId);
    console.log(delReview);
    const delFromArray = await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    console.log(delFromArray);
    res.redirect(`/listings/${id}`);
})

export {router};
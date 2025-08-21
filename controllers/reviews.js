import {Listing} from "../models/listing.js";
import {Review} from "../models/review.js";

//function to add new review and update Listing with the review's id
const addReview = async (req,res,next)=>{
    console.log("working post req");
    const {id} = req.params;
    // console.log(id);
    const {review} = req.body;
    const reviewUpdate = await Review.insertOne({
        comment:review.comment,
        rating:review.rating,
        author:req.user._id
    });
    const review_id = reviewUpdate._id;
    console.log(reviewUpdate);
    // console.log(review_id);
    const updateListing = await Listing.findByIdAndUpdate(id,  {$push:{reviews:{$each:[review_id]}}}  ,{new:true}).populate("reviews");
    req.flash("regSuccess","Review Posted Succesfully");
     console.log(updateListing);
     res.redirect(`/listings/${id}`);
}

//deleting review and removing the deleted review's id from Listing
const destroyReview = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    const delReview = await Review.findByIdAndDelete(reviewId);
    console.log(delReview);
    const delFromArray = await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    console.log(delFromArray);
    req.flash("regSuccess","Review Deleted Succesfully");
    res.redirect(`/listings/${id}`);
}

export default {
    addReview:addReview,
    destroyReview:destroyReview
}
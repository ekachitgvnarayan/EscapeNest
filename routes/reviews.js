import express from "express";
const router =express.Router({mergeParams:true});
import {asyncWrap} from "../utils/asyncWrap.js";
import {joiValidateReview} from "../utils/joiValidate.js";
import {isLoggedIn,isReviewAuthor} from "../middleware.js";
import reviewController from "../controllers/reviews.js";

//Add new review and update Listing with the review's id
router.post("/",joiValidateReview,isLoggedIn,asyncWrap(reviewController.addReview))


//deleting review and removing the deleted review's id from listing
router.delete("/:reviewId",isReviewAuthor,asyncWrap(reviewController.destroyReview))

export {router};
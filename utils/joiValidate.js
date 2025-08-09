import {ListingSchema} from "../listingSchema.js";
import {reviewSchema} from "../reviewSchema.js";
import {ExpressError} from "./ExpressError.js";
const joiValidateListing=function(req,res,next){
    const {error}=ListingSchema.validate(req.body);
    if(error){
        console.log(`Printing from ${req.method} route : joiValidate:- `);
        console.log(error);
        throw new ExpressError(400,error);
    }
    next()
}
const joiValidateReview=function(req,res,next){
    const {error}=reviewSchema.validate(req.body);
    if(error){
        console.log(`Printing from ${req.method} route : joiValidate:- `);
        console.log(error);
        throw new ExpressError(400,error);
    }
    next()
}

export {joiValidateListing,joiValidateReview};
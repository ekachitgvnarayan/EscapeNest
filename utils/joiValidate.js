import {ListingSchema} from "../listingSchema.js";
import {ExpressError} from "./ExpressError.js";
const joiValidate=function(req,res,next){
    const {error}=ListingSchema.validate(req.body);
    if(error){
        console.log(`Printing from ${req.method} route : joiValidate:- `);
        console.log(error);
        throw new ExpressError(400,error);
    }
    next()
}

export {joiValidate};
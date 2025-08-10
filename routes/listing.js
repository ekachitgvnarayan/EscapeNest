import express from "express";
const router =express.Router();
import mongoose from "mongoose";
import {Listing} from "../models/listing.js";
import {asyncWrap} from "../utils/asyncWrap.js";
import {ListingSchema} from "../listingSchema.js";
import {joiValidateListing} from "../utils/joiValidate.js";
import {ExpressError} from "../utils/ExpressError.js";


//index route - DEFAULT
router.get("/",asyncWrap(async(req,res,next)=>{
    const response=await Listing.find({});
    res.render("listings/index.ejs",{data:response});
}))

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create NEW Listing
router.post("/new",joiValidateListing,asyncWrap(async (req,res,next)=>{
//     if (req.body.image === "") {
//     delete req.body.image; // to trigger Mongoose's default
//   }
    let data = req.body;
    console.log("Printing from post route : data=req.body :- ");
    console.log(data);
    await Listing.create({
        title:data.title,
        description:data.description,
        image:data.image || "https://himkhoj.com/wp-content/uploads/2020/08/d_h-780x270.png",
        price:data.price,
        location:data.location,
        country:data.country
    })
    res.redirect("/listings");
}
))

//Route to view Specific Listing based on ID
router.get("/:id", asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError(400,"400 Bad Request");
    }
    const response=await Listing.findById(id).populate("reviews");
    if (!response) {
        throw new ExpressError(404, "Listing not found in the Database");
    }
    res.render("listings/view.ejs",{data:response});
}))

//GET route for editing A Listing
router.get("/edit/:id",asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findById(id).then((response)=>{
        // console.log(response);
        res.render("listings/edit.ejs",{data:response});
    })
}))

//Update Route
router.patch("/edit/:id",async (req,res,next)=>{
    let {id}=req.params;
    let data=req.body;
    console.log("Printing from Patch route : req.body :- ");
    console.log(data);
    const joiValidate = ListingSchema.validate(data);
    if(joiValidate.error){
        throw new ExpressError(400,joiValidate.error);
    }
    await Listing.findByIdAndUpdate(id,data,{new:true})
    .then((response)=>{
        console.log("Updated Data:");
        console.log(response);
        res.redirect(`/listings/${id}`);
    })
})

//Delete Route
router.delete("/:id",async (req,res,next)=>{
    let {id}=req.params;
    console.log("Printing from Delete route : deleted id:- ");
    console.log(id);
    await Listing.findByIdAndDelete(id)
    .then((response)=>{
        console.log(response);
        res.redirect("/listings");
    })
})

export {router};
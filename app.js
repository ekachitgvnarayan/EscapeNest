import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import methodOverride from "method-override";
import {Listing} from "./models/listing.js";
import {Review} from "./models/review.js";
import ejsMate from "ejs-mate";
import {asyncWrap} from "./utils/asyncWrap.js";
import {ExpressError} from "./utils/ExpressError.js";
import {ListingSchema} from "./listingSchema.js";
import {joiValidateListing, joiValidateReview} from "./utils/joiValidate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const port= 8000;

app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// app.set("views",path.join(__dirname,"views/listings"));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

//index route - DEFAULT
app.get("/listings",asyncWrap(async(req,res,next)=>{
    const response=await Listing.find({});
    res.render("listings/index.ejs",{data:response});
}))

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create NEW Listing
app.post("/listings/new",joiValidateListing,asyncWrap(async (req,res,next)=>{
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
app.get("/listings/:id", asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError(400,"400 Bad Request");
    }
    const response=await Listing.findById(id).populate("reviews");
    if (!response) {
        throw new ExpressError(404, "Listing not found in the Database");
    }
    console.log(response);
    res.render("listings/view.ejs",{data:response});
}))

//GET route for editing A Listing
app.get("/listings/edit/:id",asyncWrap(async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findById(id).then((response)=>{
        // console.log(response);
        res.render("listings/edit.ejs",{data:response});
    })
}))

//Update Route
app.patch("/listings/edit/:id",async (req,res,next)=>{
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
app.delete("/listings/:id",async (req,res,next)=>{
    let {id}=req.params;
    console.log("Printing from Delete route : deleted id:- ");
    console.log(id);
    await Listing.findByIdAndDelete(id)
    .then((response)=>{
        console.log(response);
        res.redirect("/listings");
    })
})

app.post("/listings/:id/reviews",joiValidateReview,asyncWrap(async (req,res,next)=>{
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

app.delete("/listings/:id/reviews/:reviewId",async(req,res,next)=>{
    let {id, reviewId} = req.params;
    const delReview = await Review.findByIdAndDelete(reviewId);
    console.log(delReview);
    const delFromArray = await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    console.log(delFromArray);
    res.redirect(`/listings/${id}`);
})

app.use((req,res,next)=>{
    next(new ExpressError(404,"Oops! Page Not Found"));
})

//custom error handler
app.use((err,req,res,next)=>{
    console.log("Printing from Custom Error Handler : Complete error:- ");
    console.error(err);
    const status = err.status || 500;
    const msgdata = err.message;
    const message = err._message /* || "Internal Server Error" */;
    console.log("Printing from Custom Error Handler : status :- ");
    console.log(status);
    console.log("Printing from Custom Error Handler : err.message :- ");
    console.log(msgdata);
    console.log("Printing from Custom Error Handler : err._message :- ");
    console.log(message);
    // res.status(err.status || 500).send(err.message+"!");
    res.status(status).render("error.ejs",{status,message,msgdata});
})

//Connection to MongoDB
await mongoose.connect('mongodb://127.0.0.1/EscapeNest')
.then(()=>{console.log("Connection to MongoDB Successful");
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
})
.catch((err)=>{console.log(err)});
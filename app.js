import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import methodOverride from "method-override";
import {ExpressError} from "./utils/ExpressError.js";
import ejsMate from "ejs-mate";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
/* import {Listing} from "./models/listing.js";
import {Review} from "./models/review.js";
import {asyncWrap} from "./utils/asyncWrap.js";
import {ListingSchema} from "./listingSchema.js";
import {joiValidateListing, joiValidateReview} from "./utils/joiValidate.js"; */

import {router as listings} from "./routes/listing.js"
import {router as reviews} from "./routes/reviews.js"

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
app.use(cookieParser());

//session option for session middleware
const sessionOptions={
    secret:"mysecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());

//flash middleware
app.use((req,res,next)=>{
    res.locals.regSuccess=req.flash("regSuccess");
    res.locals.failure=req.flash("failureMsg");
    next()
})

app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

/* //Oops! Page Not Found
app.use((req,res,next)=>{
    next(new ExpressError(404,"Oops! Page Not Found"));
}) */

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

//Connection to MongoDB and Server Start
await mongoose.connect('mongodb://127.0.0.1/EscapeNest')
.then(()=>{console.log("Connection to MongoDB Successful");
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
})
.catch((err)=>{console.log(err)});
import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from 'connect-mongo'
import flash from "connect-flash";
import passport from "passport";
import {Listing} from "./models/listing.js";
import {Review} from "./models/review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configureMiddleware = (app)=>{
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.use(express.static(path.join(__dirname,"/public")));
    app.use(cookieParser());

    //mongo store for session storage
    const store = MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        touchAfter: 24 * 3600, // time period in seconds',
        crypto:{
            secret:process.env.SESSION_SECRET
        }
    })
    store.on("error",function(e){
        console.log("Session Store Error");
        console.log(e);
    })
    //session option for session middleware
    const sessionOptions={
        store:store,
        secret:process.env.SESSION_SECRET,
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

    app.use(passport.initialize());
    app.use(passport.session());

    //flash middleware
    app.use((req,res,next)=>{
        res.locals.regSuccess=req.flash("regSuccess");
        res.locals.failure=req.flash("error");
        res.locals.currentUser=req.user;
        return next()
    })

}
function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log("not authenticated");
        req.flash("error","Please Login to create,edit or delete a Listing");
        console.log(req.session);
        return res.redirect("/account/login");
    }
    next();
}

function saveRedirectUrl(req,res,next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next()
}

async function isOwner(req,res,next){
    const {id}=req.params;
    const resp =await Listing.findById(id);
    if(!resp.owner.equals(res.locals.currentUser._id)){
            req.flash("error","You do not have permission to edit or delete");
            return res.redirect(`/listings/${id}`);
        }
        return next()
}

async function isReviewAuthor(req,res,next){
    const {id,reviewId}=req.params;
    const resp =await Review.findById(reviewId);
    if(!resp.author.equals(res.locals.currentUser._id)){
            req.flash("error","You do not have permission to delete this review");
            return res.redirect(`/listings/${id}`);
        }
        return next()
}

export {isReviewAuthor,saveRedirectUrl,isLoggedIn,isOwner,configureMiddleware};
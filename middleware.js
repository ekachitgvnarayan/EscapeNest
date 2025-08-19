import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configureMiddleware = (app)=>{
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
export  {saveRedirectUrl,isLoggedIn,configureMiddleware};
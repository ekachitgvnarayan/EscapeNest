import express from "express";
import mongoose from "mongoose";
import {asyncWrap} from "../utils/asyncWrap.js";
import {User} from "../models/user.js";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js";

const router =express.Router();

router.get("/signup",(req,res)=>{
    res.render("accounts/signup.ejs");
})

router.post("/signup",async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({
            email:email,
            username:username
        });
        const registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("regSuccess","Account Created Successfully");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("failureMsg","Sorry! Username already Exists");
        res.redirect("/account/signup");
    }
})

router.get("/login",(req,res)=>{
    res.render("accounts/login.ejs");
})

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/account/login',failureFlash:true}),
    async (req,res)=>{
        console.log(req.session);
        req.flash("regSuccess","Welcome to EscapeNest. You Logged in successfully");
        res.redirect(res.locals.redirectUrl || "/listings");
    }
)

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
            return next(err);
        }
        req.flash("regSuccess","You logged out Successfully");
        res.redirect("/listings");
    });
})
export default router;
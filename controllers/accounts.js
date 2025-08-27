import {User} from "../models/user.js";

const renderSignupForm = (req,res)=>{
    res.render("accounts/signup.ejs");
}

const signup = async (req,res,next)=>{
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
}

const renderLoginForm = (req,res)=>{
    res.render("accounts/login.ejs");
}

const login = async (req,res)=>{
        //console.log(req.session);
        req.flash("regSuccess","Welcome to EscapeNest. You Logged in successfully");
        res.redirect(res.locals.redirectUrl || "/listings");
    }

const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
            return next(err);
        }
        req.flash("regSuccess","You logged out Successfully");
        res.redirect("/listings");
    });
}

export default {
    renderSignupForm:renderSignupForm,
    signup:signup,
    renderLoginForm:renderLoginForm,
    login:login,
    logout:logout
}
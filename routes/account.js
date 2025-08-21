import express from "express";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js";
import accountController from "../controllers/accounts.js";

const router =express.Router();

router.get("/signup",accountController.renderSignupForm)

router.post("/signup",accountController.signup)

router.get("/login",accountController.renderLoginForm)

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/account/login',failureFlash:true}),
    accountController.login
)

router.get("/logout",accountController.logout)

export default router;
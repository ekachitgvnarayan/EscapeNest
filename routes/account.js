import express from "express";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js";
import accountController from "../controllers/accounts.js";

const router =express.Router();

router.route("/signup")
.get(accountController.renderSignupForm)
.post(accountController.signup);

router.route("/login")
.get(accountController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/account/login',failureFlash:true}),
    accountController.login)

router.get("/logout",accountController.logout)

export default router;
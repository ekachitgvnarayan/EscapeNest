import express from "express";
import {asyncWrap} from "../utils/asyncWrap.js";
import {joiValidateListing} from "../utils/joiValidate.js";
import {isLoggedIn,isOwner} from "../middleware.js";
import ListingController from "../controllers/listings.js";
import {storage} from "../cloudConfig.js";
import multer from "multer";
const upload=multer({storage});

const router =express.Router();

//index route - DEFAULT
router.get("/",asyncWrap(ListingController.index));

router.route("/new")
//NewPost GET page
.get(isLoggedIn,ListingController.renderNewForm)
//Create NEW Listing
.post(isLoggedIn,joiValidateListing,upload.single("imageInput"),asyncWrap(ListingController.newPost))


//Route to view Specific Listing based on ID
router.get("/:id", asyncWrap(ListingController.showListing))

//GET route for editing A Listing
router.get("/edit/:id",isLoggedIn,asyncWrap(ListingController.renderEditForm))

//Update Route
router.patch("/edit/:id",isLoggedIn,isOwner,upload.single("image"),asyncWrap(ListingController.updateListing))

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,asyncWrap(ListingController.destroyListing))

export {router};
import mongoose from "mongoose";
import {Listing} from "../models/listing.js";
import {ListingSchema} from "../listingSchema.js";
import {ExpressError} from "../utils/ExpressError.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapBoxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

const index = async(req,res,next)=>{
    const response=await Listing.find({});
    res.render("listings/index.ejs",{data:response});
}

// /new GET function
const renderNewForm = (req,res)=>{
        //console.log("authenticated");
        //console.log(req.user);
        res.render("listings/new.ejs");
    
}

// /new POST function
const newPost = async (req,res,next)=>{
    let data = req.body;
    const mbxcode = await geocoder.forwardGeocode({
        query: data.location,
        limit: 1
    })
  .send();
    //console.log(mbxcode.body);
    //console.log(mbxcode.body.features);
    //console.log(mbxcode.body.features[0].geometry);

    let url = "https://himkhoj.com/wp-content/uploads/2020/08/d_h-780x270.png";
    let filename="listingimage";
    if(req.file){url=req.file.path,filename= req.file.filename};
    // console.log("Printing from post route : data=req.body :- ");
    // console.log(data);
    
    await Listing.create({
        title:data.title,
        description:data.description,
        image:{url:url, filename:filename},
        price:data.price,
        location:data.location,
        country:data.country,
        owner:req.user._id,
        geometry:mbxcode.body.features[0].geometry
    }).then((response)=>{
        //console.log(response);
        req.flash("regSuccess","Listing Registered Succesfully");
    })
    res.redirect("/listings");
}

// Function to view Specific Listing based on ID
const showListing = async(req,res,next)=>{
    let {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError(400,"400 Bad Request");
    }
    const response=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!response) {
        // req.flash("error","Listing Not Found");
        throw new ExpressError(404, "Listing not found in the Database");
    }
    //console.log(response);
    res.render("listings/view.ejs",{data:response});
}

//function to GET page for editing A Listing
const renderEditForm =async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findById(id).then((response)=>{
        // console.log(response);
        res.render("listings/edit.ejs",{data:response});
    })
}

// Function to Update Listing Patch
const updateListing = async (req,res,next)=>{
    let url = "https://himkhoj.com/wp-content/uploads/2020/08/d_h-780x270.png";
    let filename="listingimage";
    let {id}=req.params;
    let data=req.body;
    //console.log("Printing from Patch route : req.body :- ");
    //console.log(data);
    const joiValidate = ListingSchema.validate(data);
    if(joiValidate.error){
        throw new ExpressError(400,joiValidate.error);
    }
    let listing = await Listing.findByIdAndUpdate(id,data,{new:true});
    
    if(req.file){
        url=req.file.path,
        filename= req.file.filename;
        listing.image={url,filename};
        await listing.save();
    };
    //console.log("Updated Data:");
    //console.log(listing);
    req.flash("regSuccess","Listing Updated Succesfully");
    res.redirect(`/listings/${id}`);
    
}

//Function to Delete 

const destroyListing = async (req,res,next)=>{
    let {id}=req.params;
    //.log("Printing from Delete route : deleted id:- ");
    //console.log(id);
    await Listing.findByIdAndDelete(id)
    .then((response)=>{
        //console.log(response);
        req.flash("regSuccess","Listing Deleted Succesfully");
        res.redirect("/listings");
    })
}

//export {index,renderNewForm,newPost,showListing,renderEditForm,updateListing,destroyListing};
export default {
    index:index,
    renderNewForm:renderNewForm,
    newPost:newPost,
    showListing:showListing,
    renderEditForm:renderEditForm,
    updateListing:updateListing,
    destroyListing:destroyListing
}
import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import methodOverride from "method-override";
import {Listing} from "./models/listing.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const port= 8000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views/listings"));
// app.set("views",path.join(__dirname,"views/listings"));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Connection to MongoDB
await mongoose.connect('mongodb://127.0.0.1/EscapeNest')
.then(()=>{console.log("Connection to MongoDB Successful");
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
})
.catch((err)=>{console.log(err)});


app.get("/",(req,res)=>{
    res.render("home.ejs");
})

//index route - DEFAULT
app.get("/listings",(req,res)=>{
    Listing.find({}).then((response)=>{
        //console.log(response);
        res.render("index.ejs",{data:response});
    })
    
})

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

//Create NEW Listing
app.post("/listings/new",async (req,res)=>{
    let data = req.body;
    await Listing.insertOne({
        title:data.title,
        description:data.description,
        image:data.image,
        price:data.price,
        location:data.location,
        country:data.country
    })
    .then((response)=>{
        console.log(response);
        res.redirect("/listings");
    })
})

//Route to view Specific Listing based on ID
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findById(id).then((response)=>{
        res.render("view.ejs",{data:response});
    })
})

//GET route for editing A Listing
app.get("/listings/edit/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findById(id).then((response)=>{
        // console.log(response);
        res.render("edit.ejs",{data:response});
    })
    
})

//Update Route
app.patch("/listings/edit/:id",async (req,res)=>{
    let {id}=req.params;
    let data=req.body;
    await Listing.findByIdAndUpdate(id,data,{new:true})
    .then((response)=>{
        console.log("Updated Data:");
        console.log(response);
        res.redirect(`/listings/${id}`);
    })
})

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id)
    .then((response)=>{
        console.log(response);
        res.redirect("/listings");
    })
})
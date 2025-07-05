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

//index route
app.get("/listings",(req,res)=>{
    Listing.find({}).then((response)=>{
        //console.log(response);
        res.render("index.ejs",{data:response});
    })
    
})

app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findById(id).then((response)=>{
        res.render("view.ejs",{data:response});
    })
})
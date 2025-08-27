import 'dotenv/config';
import express from "express";
import path from "node:path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import {ExpressError} from "./utils/ExpressError.js";
import ejsMate from "ejs-mate";
import passport from "passport";
import LocalStrategy from "passport-local";
import {User} from "./models/user.js";
import {configureMiddleware} from "./middleware.js";
import {router as listingsRoute} from "./routes/listing.js";
import {router as reviewsRoute} from "./routes/reviews.js";
import accountRoute from "./routes/account.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const port= 8000;

app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
configureMiddleware(app);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.redirect("/listings");
    // res.render("listings/home.ejs");
})

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/account",accountRoute);

// Oops! Page Not Found
app.use((req,res,next)=>{
    next(new ExpressError(404,"Oops! Page Not Found"));
})

//custom error handler
app.use((err,req,res,next)=>{
    console.log("Printing from Custom Error Handler : Complete error:- ");
    console.error(err);
    const status = err.status || 500;
    const msgdata = err.message;
    const message = err._message /* || "Internal Server Error" */;
    console.log("Printing from Custom Error Handler : status :- ");
    console.log(status);
    console.log("Printing from Custom Error Handler : err.message :- ");
    console.log(msgdata);
    console.log("Printing from Custom Error Handler : err._message :- ");
    console.log(message);
    // res.status(err.status || 500).send(err.message+"!");
    res.status(status).render("error.ejs",{status,message,msgdata});
})

//connect to mongoDB and start server
const atlasDbUrl=process.env.ATLASDB_URL;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run(){
    await mongoose.connect(atlasDbUrl, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
await run().then(()=>{
    app.listen(port,()=>{
        console.log(`Listening on port ${port}`)
    })
})
import mongoose from "mongoose";
import {Listing} from "./models/listing.js";

await mongoose.connect('mongodb://127.0.0.1/EscapeNest')
.then(()=>{console.log("Connection to Mongo Server Successfull ")})
.catch((err)=>{console.log(err)});

// await Listing.insertOne({
//     title:"TourEscape Hotels and Homes",
//     description:"Modern, cozy room in the heart of the city. Enjoy a comfy queen bed, fast Wi-Fi, smart TV, and a private bathroom.",
//     image:"https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg",
//     price:5_000,
//     location:"Mumbai",
//     country:"India"
// }).then((resp)=>{
//     console.log(resp)
// })

const data = [
  {
    "title": "Beachfront Sunset Suite",
    "description": "Sea-view room, queen bed, fast Wi-Fi.",
    "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEyfHxicmVhaCUyMHBsYWNlfGVufDB8fHx8MTY4MjM2Njc2OA&ixlib=rb-1.2.1&q=80&w=1080",
    "price": 7800,
    "location": "Goa",
    "country": "India"
  },
  {
    "title": "City Hotel Deluxe",
    "description": "Spacious king bed, balcony, Wi-Fi.",
    "image": "https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg",
    "price": 6400,
    "location": "Mumbai",
    "country": "India"
  },
  {
    "title": "Tokyo Urban Stay",
    "description": "Cozy room, smart TV, queen bed.",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGhvdGVsJTIwcm9vbXxlbnwwfHx8fDE2ODIzNjY2MDk&ixlib=rb-1.2.1&q=80&w=1080",
    "price": 7100,
    "location": "Tokyo",
    "country": "Japan"
  },
  {
    "title": "Mountain View BnB",
    "description": "Comfortable room with balcony and view.",
    "image": "https://cdn.pixabay.com/photo/2024/10/02/08/59/woman-9090270_1280.jpg",
    "price": 5600,
    "location": "Queenstown",
    "country": "New Zealand"
  },
  {
    "title": "Peaceful Countryside Inn",
    "description": "Classic decor, twin beds, private bath.",
    "image": "https://cdn.pixabay.com/photo/2014/05/21/14/56/bedroom-349701_1280.jpg",
    "price": 3200,
    "location": "Alsace",
    "country": "France"
  },
  {
    "title": "Vintage Heritage Hotel",
    "description": "Wooden interiors, double bed, great vibe.",
    "image": "https://cdn.pixabay.com/photo/2013/09/16/18/40/hotel-182916_1280.jpg",
    "price": 4800,
    "location": "Jaipur",
    "country": "India"
  },
  {
    "title": "Modern Suite in Seoul",
    "description": "Minimalist decor, king bed, smart room.",
    "image": "https://cdn.pixabay.com/photo/2023/11/23/12/32/interior-8407973_1280.jpg",
    "price": 8700,
    "location": "Seoul",
    "country": "South Korea"
  },
  {
    "title": "Luxury Burj Al Arab Room",
    "description": "Iconic 7-star suite, sea view.",
    "image": "https://cdn.pixabay.com/photo/2017/08/10/16/11/burj-al-arab-2624317_1280.jpg",
    "price": 100000,
    "location": "Dubai",
    "country": "UAE"
  },
  {
    "title": "Resort Walkway Stay",
    "description": "Green surroundings, cozy stay, free Wi-Fi.",
    "image": "https://cdn.pixabay.com/photo/2014/05/18/19/15/walkway-347319_1280.jpg",
    "price": 3900,
    "location": "Ubud",
    "country": "Indonesia"
  },
  {
    "title": "Modern Bath Suite",
    "description": "Private bath, sleek interiors, ambient lighting.",
    "image": "https://cdn.pixabay.com/photo/2023/05/19/14/33/bathroom-8004699_1280.jpg",
    "price": 6600,
    "location": "Barcelona",
    "country": "Spain"
  }
];

await Listing.insertMany(data).then((resp)=>{
    console.log(resp)
})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
});
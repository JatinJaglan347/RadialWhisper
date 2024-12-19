import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";

dotenv.config({
    path: "./.env"
});

connectDB();
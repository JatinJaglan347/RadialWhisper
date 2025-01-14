import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
import { ApiError } from './utils/ApiError.js';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieparser());

//routes import
import userRouter from './routes/user.router.js';
import updateRouter from './routes/infoUpdate.router.js';

//routes declaration
app.use("/api/v1/user" , userRouter)
app.use("/api/v1/update", updateRouter)



// Error handling middleware (place it here)
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors,
            success: err.success,
        });
    }
    return res.status(500).json({
        message: "Something went wrong!",
    });
});

export {app};
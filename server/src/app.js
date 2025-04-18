import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
import { ApiError } from './utils/ApiError.js';
import './scheduler/activeUserSnapshot.scheduler.js';
import './scheduler/messageRetention.scheduler.js';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // origin: ['http://localhost:5173', 'https://2gfrh047-5173.inc1.devtunnels.ms/'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieparser());

// Routes import
import userRouter from './routes/user.router.js';
import updateUserFieldRouter from './routes/updateUserField.routes.js';
import updateRouter from './routes/infoUpdate.router.js';
import opRouter from './routes/userInfoRules.router.js';
import manageUserRouter from './routes/manageUser.route.js';
import suggestionRouter from './routes/suggestion.route.js';
import contact from './routes/contact.routes.js'
import activityStatus from './routes/activityStatus.routes.js'
import friend from './routes/friend.router.js'
import reviewRouter from './routes/review.routes.js'
import overlordRouter from './routes/overlord.routes.js'
import otpRouter from './routes/otp.routes.js'
import testRouter from './routes/test.routes.js'

// Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", updateUserFieldRouter);
app.use("/api/v1/user", activityStatus);
app.use("/api/v1/update", updateRouter);
app.use("/api/v1/op", opRouter);
app.use("/api/v1/op", manageUserRouter );
app.use("/api/v1/suggestions", suggestionRouter);
app.use("/api/v1/contact", contact);
app.use("/api/v1/friend", friend);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/overlord", overlordRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/test", testRouter);

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

export { app };
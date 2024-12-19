import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
const app = express();

app.use(cors({
    orgin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieparser());

//routes import
import userRouter from './routes/user.router.js';


//routes declaration
app.use("/api/v1/user" , userRouter)
export {app};
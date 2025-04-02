import dotenv from "dotenv";
import http from "http";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { initializeSocket } from "./routes/socket.routes.js";



dotenv.config({
    path: "./.env"
});

// Create an HTTP server and attach Express app
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Connect to MongoDB
connectDB()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    });

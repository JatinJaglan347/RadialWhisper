import {Server} from "socket.io";
import {createServer} from "http";
import {create} from "domain";
import {express} from "express";
import { app } from "../app";

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin : "*",
        methods: ["GET", "POST" , "PUT" , "PATCH" , "DELETE"],

    }

})
io.on("connection", (socket) => {
    console.log("user connected with socket id:", socket.id);
})
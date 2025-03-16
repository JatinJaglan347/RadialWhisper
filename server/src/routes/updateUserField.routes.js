import express from "express";
import { updateUserField } from "../controllers/updateUserField.controller.js";


const router = express.Router();

router.patch("/update-field", updateUserField); // Protect the route

export default router;

import { Router } from "express";
import {
    createSuggestion,
    getSuggestions,
    getSuggestionById,
    updateSuggestion,
    deleteSuggestion,
    likeSuggestion,
   
} from "../controllers/suggestions.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/").get(getSuggestions);
router.route("/:id").get(getSuggestionById);

// Protected Routes
router.route("/create").post(verifyJWT, createSuggestion);
router.put("/updatesuggestion/:id", updateSuggestion);
router.delete("/deletesuggestion/:id", deleteSuggestion);
router.route("/:id/like").post(verifyJWT, likeSuggestion);



export default router;
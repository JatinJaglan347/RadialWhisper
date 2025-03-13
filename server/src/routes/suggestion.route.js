import { Router } from "express";
import {
    createSuggestion,
    getSuggestions,
    getSuggestionById,
    updateSuggestion,
    deleteSuggestion,
    likeSuggestion,
    dislikeSuggestion
} from "../controllers/suggestions.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/").get(getSuggestions);
router.route("/:id").get(getSuggestionById);

// Protected Routes
router.route("/create").post(createSuggestion);
router.route("/:id").put( updateSuggestion).delete( deleteSuggestion);
router.route("/:id/like").post(likeSuggestion);
router.route("/:id/dislike").post( dislikeSuggestion);

export default router;
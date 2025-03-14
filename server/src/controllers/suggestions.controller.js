import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Suggestion } from "../models/suggestion.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSuggestion = asyncHandler(async (req, res) => {
    const { title, category, description, userId } = req.body;
    
    if (!title || !category || !description || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    const suggestion = await Suggestion.create({
        title,
        category,
        description,
        user:userId,
        dateCreated: new Date(),
        likes: 0,
        dislikes: 0,
    });

    return res.status(201).json(new ApiResponse(201, suggestion, "Suggestion created successfully"));
});

const getSuggestions = asyncHandler(async (req, res) => {
    const suggestions = await Suggestion.find();
    return res.status(200).json(new ApiResponse(200, suggestions, "Suggestions fetched successfully"));
});

const getSuggestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
        throw new ApiError(404, "Suggestion not found");
    }
    return res.status(200).json(new ApiResponse(200, suggestion, "Suggestion fetched successfully"));
});

const updateSuggestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, category, description } = req.body;
    
    const updatedSuggestion = await Suggestion.findByIdAndUpdate(
        id,
        { title, category, description },
        { new: true, runValidators: true }
    );
    
    if (!updatedSuggestion) {
        throw new ApiError(404, "Suggestion not found");
    }
    
    return res.status(200).json(new ApiResponse(200, updatedSuggestion, "Suggestion updated successfully"));
});

const deleteSuggestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedSuggestion = await Suggestion.findByIdAndDelete(id);
    
    if (!deletedSuggestion) {
        throw new ApiError(404, "Suggestion not found");
    }
    
    return res.status(200).json(new ApiResponse(200, {}, "Suggestion deleted successfully"));
});

const likeSuggestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // Get the userId from request

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) {
        throw new ApiError(404, "Suggestion not found");
    }

    const userIndex = suggestion.likedBy.indexOf(userId);

    if (userIndex === -1) {
        // User has not liked before → Add like
        suggestion.likes += 1;
        suggestion.likedBy.push(userId);
    } else {
        // User has already liked → Remove like
        suggestion.likes -= 1;
        suggestion.likedBy.splice(userIndex, 1);
    }

    await suggestion.save();
    return res.status(200).json(new ApiResponse(200, suggestion, "Suggestion like updated"));
});





export {
    createSuggestion,
    getSuggestions,
    getSuggestionById,
    updateSuggestion,
    deleteSuggestion,
    likeSuggestion,
    
};

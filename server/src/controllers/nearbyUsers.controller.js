import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to update location and fetch nearby users

const updateLocationAndFetchNearbyUsers = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Get user ID from the authenticated token
    const { latitude, longitude } = req.body; // Get latitude and longitude from request body

    // Validate coordinates
    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180
    ) {
        throw new ApiError(400, "Invalid coordinates. Latitude and Longitude must be valid.");
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Log user's currentLocation and locationRadiusPreference to debug
    // console.log("User data:", user);
    // console.log("Current Location:", user.currentLocation);
    // console.log("Location Radius Preference:", user.locationRadiusPreference);

    // Check that the user has valid location and radius
    if (!user.currentLocation || !user.locationRadiusPreference || !user.currentLocation.coordinates || !user.locationRadiusPreference) {
        console.log("Location or radius preference is missing!");
        throw new ApiError(400, "Location or radius preference not available");
    }

    // Update the user's location (assuming you already have the updateLocation method in your model)
    await user.updateLocation(latitude, longitude);

    // Convert radius from meters to kilometers and then to radians
    const radiusInKm = user.locationRadiusPreference / 1000; // Convert meters to kilometers
    const radiusInRadians = radiusInKm / 6378.1; // Convert kilometers to radians for geo query

    // Log the radius to verify the conversion
    console.log("Radius in km:", radiusInKm);
    console.log("Radius in radians:", radiusInRadians);

    // Find nearby users within the location radius
    const nearbyUsers = await User.find({
        currentLocation: {
            $geoWithin: {
                $centerSphere: [
                    user.currentLocation.coordinates, // User's coordinates [longitude, latitude]
                    radiusInRadians  // Radius in radians
                ]
            }
        },
        _id: { $ne: userId } // Exclude the current user from the result
    }).select("-password -refreshToken -dateOfBirth");

    // Log the nearby users query result
    // console.log("Nearby Users Found:", nearbyUsers);

    // If no nearby users are found
    if (nearbyUsers.length === 0) {
        console.log("No nearby users found within the specified radius.");
    }

    // Send response with the list of nearby users
    return res.status(200).json(
        new ApiResponse(200, { nearbyUsers }, "Nearby users fetched successfully")
    );
});


export { updateLocationAndFetchNearbyUsers };

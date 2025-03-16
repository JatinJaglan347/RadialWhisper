import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Contact } from "../models/contact.model.js";
import { User } from "../models/user.model.js";

// Submit Contact Form
const submitContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message, isExistingUser } = req.body;

    if (!name || !email || !subject || !message) {
        throw new ApiError(400, "All fields are required");
    }

    let userId = null;

    if (isExistingUser) {
        const user = await User.findOne({ email }).select("_id");
        if (user) {
            userId = user._id;
        }
    }

    const contactEntry = await Contact.create({
        name,
        email,
        subject,
        message,
        isExistingUser,
        user: userId
    });

    return res.status(201).json(new ApiResponse(201, contactEntry, "Contact request submitted successfully"));
});

// Get Contacts with Filtering
const getContacts = asyncHandler(async (req, res) => {
    let { email, contactCompleted } = req.query;
    const query = {};

    if (email) query.email = email.toLowerCase();
    if (contactCompleted !== undefined) query.contactCompleted = contactCompleted === "true";

    const contacts = await Contact.find(query)
        .populate("user", "fullName email") // If user exists, fetch user details
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});

// Admin Marks Contact as Completed
const updateContactStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { contactCompleted } = req.body;

    if (contactCompleted === undefined) {
        throw new ApiError(400, "Contact completion status is required");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { contactCompleted },
        { new: true }
    );

    if (!updatedContact) {
        throw new ApiError(404, "Contact not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedContact, "Contact status updated successfully"));
});

export { submitContact, getContacts, updateContactStatus };

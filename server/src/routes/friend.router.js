// friend.router.js
import { Router } from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  listFriends,
  listFriendRequests,
} from "../controllers/friend.controller.js";

const router = Router();

// Endpoint to send a friend request
router.post("/request", sendFriendRequest);

// Endpoint to accept a friend request
router.post("/accept", acceptFriendRequest);

// Endpoint to reject a friend request
router.post("/reject", rejectFriendRequest);

// Endpoint to remove a friend
router.delete("/remove", removeFriend);

// Endpoint to list all friends of a user
router.get("/listFriends/:userId", listFriends);

// Endpoint to list all incoming friend requests for a user
router.get("/requests/:userId", listFriendRequests);

export default router;

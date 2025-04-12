import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyKingRole } from "../middlewares/role.middleware.js";
import {
  // User Management
  getUserDetails,
  editUserData,
  forceResetPassword,
  deleteUserAccount,
  getUserMessages,
  getUserLocationHistory,
  getTemporaryUsers,
  
  // Dashboard
  getDashboardStats,
  
  // Database Operations
  executeRawDbQuery,
  getCollectionsList,
  createDbBackup,
  listBackups,
  deleteBackup,
  
  // Security Operations
  getAllUserSessions,
  forceLogoutUser,
  forceLogoutAllUsers
} from "../controllers/overlord.controller.js";

const router = Router();

// All routes need both authentication and king role
router.use(verifyJWT, verifyKingRole);

// User Management Routes
router.post("/user-details", getUserDetails);
router.post("/edit-user", editUserData);
router.post("/reset-password", forceResetPassword);
router.post("/delete-user", deleteUserAccount);
router.post("/user-messages", getUserMessages);
router.post("/user-location-history", getUserLocationHistory);
router.post("/temporary-users", getTemporaryUsers);

// Dashboard Routes
router.get("/dashboard-stats", getDashboardStats);

// Database Operations Routes
router.post("/db-query", executeRawDbQuery);
router.get("/collections", getCollectionsList);
router.post("/create-backup", createDbBackup);
router.get("/backups", listBackups);
router.post("/delete-backup", deleteBackup);

// Security Operations Routes
router.get("/user-sessions", getAllUserSessions);
router.post("/force-logout", forceLogoutUser);
router.post("/force-logout-all", forceLogoutAllUsers);

export default router; 
import {Router} from "express";
import {banUnbanUser,getAdminStats,getUsers,adminSearchUser ,promoteDemoteUser} from "../controllers/manageUser.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";


const router = Router();

router.post("/ban-unban",banUnbanUser);
router.get("/stats",verifyJWT,verifyAdminRole, getAdminStats);
router.get("/getusers",verifyJWT, getUsers);
router.get("/adminsearchuser",adminSearchUser);
router.post("/promotedemoteuser",promoteDemoteUser);
export default router;
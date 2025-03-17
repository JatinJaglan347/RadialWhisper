import {Router} from "express";
import {banUnbanUser,getAdminStats,getUsers,adminSearchUser ,promoteDemoteToModerator ,promoteDemoteToAdmin} from "../controllers/manageUser.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";


const router = Router();

router.post("/ban-unban",banUnbanUser);
router.get("/stats",verifyJWT, getAdminStats);
router.get("/getusers",verifyJWT, getUsers);
router.get("/adminsearchuser",adminSearchUser);
router.post("/promotedemotetomoderator",promoteDemoteToModerator);
router.post("/promotedemotetoadmin",promoteDemoteToAdmin);

export default router;
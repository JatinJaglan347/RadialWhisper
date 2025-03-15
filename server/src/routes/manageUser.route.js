import {Router} from "express";
import {banUnbanUser,getAdminStats,getUsers} from "../controllers/manageUser.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";


const router = Router();

router.route("/ban-unban").post(banUnbanUser);
router.get("/stats",verifyJWT,verifyAdminRole, getAdminStats);
router.get("/getusers",verifyJWT, getUsers);

export default router;
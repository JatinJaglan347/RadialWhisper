import {Router} from "express";
import {banUnbanUser,getAdminStats} from "../controllers/manageUser.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";


const router = Router();

router.route("/ban-unban").post(banUnbanUser);
router.get("/stats", getAdminStats);

export default router;
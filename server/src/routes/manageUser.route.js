import {Router} from "express";
import {banUnbanUser} from "../controllers/manageUser.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";


const router = Router();

router.route("/ban-unban").post(banUnbanUser);

export default router;
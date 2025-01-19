import {Router} from "express";
import {getUserInfoRules} from "../controllers/userInfoRules.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";

const router = Router();

router.route("/user-info-rules").get(getUserInfoRules)

export default router
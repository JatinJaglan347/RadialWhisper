import {Router} from "express";
import {getUserInfoRules , updateUserInfoRules } from "../controllers/userInfoRules.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {verifyAdminRole} from "../middlewares/role.middleware.js";

const router = Router();

router.route("/user-info-rules").post(verifyJWT,getUserInfoRules)
router.route("/update-user-info-rules").patch(verifyJWT,verifyAdminRole,updateUserInfoRules)

export default router
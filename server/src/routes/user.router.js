import { Router } from "express";
import { registerUser ,loginUser , logoutUser , refreshAccessToken, checkAuth } from "../controllers/user.controller.js";
import { userDetails } from "../controllers/userDetails.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register") .post(registerUser)
router.route("/login").post(loginUser)


// secured routers
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post (refreshAccessToken)
router.route("/checkAuth").get (verifyJWT,checkAuth)
router.route("/userDetails").get(verifyJWT,userDetails)
export default router;




import {Router} from "express";
import {userFullnameUpdate} from "../controllers/userDetailUpdate.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/fullname").post(verifyJWT,userFullnameUpdate)

export default router;
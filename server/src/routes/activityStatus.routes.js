// server/src/routes/activityStatus.routes.js

import { Router } from "express";
import { updateActivityStatus } from "../controllers/activityStatus.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/update-activity").post(updateActivityStatus);

export default router;
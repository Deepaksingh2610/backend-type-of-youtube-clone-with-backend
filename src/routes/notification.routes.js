import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getNotifications);
router.route("/read").patch(markAsRead);

export default router;

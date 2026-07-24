import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.get("/dashboard", authenticate, adminMiddleware, adminController.dashboard.bind(adminController));

router.get("/users", authenticate, adminMiddleware, adminController.listUsers.bind(adminController));
router.get("/users/:id", authenticate, adminMiddleware, adminController.getUserDetails.bind(adminController));
router.put("/users/:id", authenticate, adminMiddleware, adminController.updateUser.bind(adminController));
router.delete("/users/:id", authenticate, adminMiddleware, adminController.deleteUser.bind(adminController));

export default router;

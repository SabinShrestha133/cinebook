import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate, adminMiddleware, requirePermission } from "../middlewares/authorized.middleware";
import { PERMISSIONS } from "../constants";

const router = Router();

router.get("/dashboard", authenticate, adminMiddleware, adminController.dashboard.bind(adminController));

router.get("/users", authenticate, adminMiddleware, requirePermission(PERMISSIONS.USER_MANAGE), adminController.listUsers.bind(adminController));
router.get("/users/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.USER_MANAGE), adminController.getUserDetails.bind(adminController));
router.put("/users/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.USER_MANAGE), adminController.updateUser.bind(adminController));
router.delete("/users/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.USER_MANAGE), adminController.deleteUser.bind(adminController));

router.get("/bookings", authenticate, adminMiddleware, requirePermission(PERMISSIONS.BOOKING_VIEW), adminController.listBookings.bind(adminController));

export default router;

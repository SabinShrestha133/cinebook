import { Router } from "express";
import { superAdminController } from "../controllers/superadmin.controller";
import { authenticate, superAdminMiddleware } from "../middlewares/authorized.middleware";
// no body validation for admin creation yet; can add Zod schema later

const router = Router();

router.get("/admins", authenticate, superAdminMiddleware, superAdminController.listAdmins.bind(superAdminController));
router.post("/admins", authenticate, superAdminMiddleware, superAdminController.createAdmin.bind(superAdminController));
router.put("/admins/:id/active", authenticate, superAdminMiddleware, superAdminController.setActive.bind(superAdminController));
router.put("/admins/:id", authenticate, superAdminMiddleware, superAdminController.updateAdmin.bind(superAdminController));

export default router;

import { Router } from "express";
import { superAdminController } from "../controllers/superadmin.controller";
import { authenticate, superAdminMiddleware } from "../middlewares/authorized.middleware";
import { audit } from "../middlewares/audit.middleware";

const router = Router();

router.get("/admins", authenticate, superAdminMiddleware, audit("Admin", "LIST_ADMINS"), superAdminController.listAdmins.bind(superAdminController));
router.post("/admins", authenticate, superAdminMiddleware, audit("Admin", "CREATE_ADMIN"), superAdminController.createAdmin.bind(superAdminController));
router.put("/admins/:id/active", authenticate, superAdminMiddleware, audit("Admin", "SET_ADMIN_ACTIVE"), superAdminController.setActive.bind(superAdminController));
router.put("/admins/:id", authenticate, superAdminMiddleware, audit("Admin", "UPDATE_ADMIN"), superAdminController.updateAdmin.bind(superAdminController));
router.get("/admins", authenticate, superAdminMiddleware, superAdminController.listAdmins.bind(superAdminController));
router.post("/admins", authenticate, superAdminMiddleware, superAdminController.createAdmin.bind(superAdminController));
router.put("/admins/:id/active", authenticate, superAdminMiddleware, superAdminController.setActive.bind(superAdminController));
router.put("/admins/:id", authenticate, superAdminMiddleware, superAdminController.updateAdmin.bind(superAdminController));

export default router;

import { Router } from "express";
import { hallController } from "../controllers/hall.controller";
import { authenticate, adminMiddleware, requirePermission } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createHallSchema, updateHallSchema } from "../validators/hall.validator";
import { PERMISSIONS } from "../constants";

const router = Router();

router.post("/", authenticate, adminMiddleware, requirePermission(PERMISSIONS.HALL_MANAGE), validateBody(createHallSchema), hallController.create.bind(hallController));
router.get("/", authenticate, adminMiddleware, hallController.list.bind(hallController));
router.get("/:id", authenticate, adminMiddleware, hallController.get.bind(hallController));
router.put("/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.HALL_MANAGE), validateBody(updateHallSchema), hallController.update.bind(hallController));
router.delete("/:id", authenticate, adminMiddleware, requirePermission(PERMISSIONS.HALL_MANAGE), hallController.delete.bind(hallController));
router.post("/:id/generate", authenticate, adminMiddleware, requirePermission(PERMISSIONS.HALL_MANAGE), hallController.generate.bind(hallController));

export default router;

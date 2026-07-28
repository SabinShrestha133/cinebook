import { Router } from "express";
import { dayDiscountController } from "../controllers/day-discount.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";
import { createDayDiscountSchema, updateDayDiscountSchema } from "../validators/day-discount.validator";

const router = Router();

router.get("/", dayDiscountController.list.bind(dayDiscountController));
router.get("/:id", dayDiscountController.get.bind(dayDiscountController));

router.post(
    "/",
    authenticate,
    adminMiddleware,
    permission("discount:manage"),
    audit("DayDiscount", "CREATE_DAY_DISCOUNT"),
    validateBody(createDayDiscountSchema),
    dayDiscountController.create.bind(dayDiscountController)
);

router.put(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("discount:manage"),
    audit("DayDiscount", "UPDATE_DAY_DISCOUNT"),
    validateBody(updateDayDiscountSchema),
    dayDiscountController.update.bind(dayDiscountController)
);

router.delete(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("discount:manage"),
    audit("DayDiscount", "DELETE_DAY_DISCOUNT"),
    dayDiscountController.remove.bind(dayDiscountController)
);

export default router;

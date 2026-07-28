import { Router } from "express";
import { movieController } from "../controllers/movie.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";
import { createMovieSchema, updateMovieSchema } from "../validators/movie.validator";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", movieController.list.bind(movieController));
router.get("/:id", movieController.get.bind(movieController));

router.post(
    "/",
    authenticate,
    adminMiddleware,
    permission("movie:create"),
    audit("Movie", "CREATE_MOVIE"),
    uploads.single("poster"),
    validateBody(createMovieSchema),
    movieController.create.bind(movieController)
);

router.put(
    "/:id",
    authenticate,
    adminMiddleware,
    permission("movie:update"),
    audit("Movie", "UPDATE_MOVIE"),
    uploads.single("poster"),
    validateBody(updateMovieSchema),
    movieController.update.bind(movieController)
);

export default router;

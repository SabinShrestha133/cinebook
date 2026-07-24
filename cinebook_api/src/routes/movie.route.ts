import { Router } from "express";
import { movieController } from "../controllers/movie.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createMovieSchema } from "../validators/movie.validator";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", movieController.list.bind(movieController));
router.get("/:id", movieController.get.bind(movieController));
router.post("/", authenticate, adminMiddleware, uploads.single('poster'), validateBody(createMovieSchema), movieController.create.bind(movieController));

export default router;

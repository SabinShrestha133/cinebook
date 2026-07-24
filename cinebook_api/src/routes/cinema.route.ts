import { Router } from "express";
import { cinemaController } from "../controllers/cinema.controller";

const router = Router();

router.get("/", cinemaController.list.bind(cinemaController));

export default router;

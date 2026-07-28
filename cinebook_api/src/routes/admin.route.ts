import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticate, adminMiddleware } from "../middlewares/authorized.middleware";
import { permission } from "../middlewares/permission.middleware";
import { audit } from "../middlewares/audit.middleware";

const router = Router();

router.get("/dashboard", authenticate, adminMiddleware, adminController.dashboard.bind(adminController));

router.get("/users", authenticate, adminMiddleware, permission("user:manage"), audit("User", "LIST_USERS"), adminController.listUsers.bind(adminController));
router.get("/users/:id", authenticate, adminMiddleware, permission("user:manage"), audit("User", "VIEW_USER"), adminController.getUserDetails.bind(adminController));
router.put("/users/:id", authenticate, adminMiddleware, permission("user:manage"), audit("User", "UPDATE_USER"), adminController.updateUser.bind(adminController));
router.delete("/users/:id", authenticate, adminMiddleware, permission("user:manage"), audit("User", "DELETE_USER"), adminController.deleteUser.bind(adminController));

router.get("/bookings", authenticate, adminMiddleware, permission("booking:view"), audit("Booking", "LIST_BOOKINGS"), adminController.listAllBookings.bind(adminController));

router.get("/showtimes", authenticate, adminMiddleware, audit("Showtime", "LIST_SHOWTIMES"), adminController.listShowtimes.bind(adminController));
router.get("/showtimes/:id", authenticate, adminMiddleware, audit("Showtime", "VIEW_SHOWTIME"), adminController.getShowtime.bind(adminController));
router.put("/showtimes/:id", authenticate, adminMiddleware, permission("showtime:update"), audit("Showtime", "UPDATE_SHOWTIME"), adminController.updateShowtime.bind(adminController));
router.delete("/showtimes/:id", authenticate, adminMiddleware, permission("showtime:delete"), audit("Showtime", "DELETE_SHOWTIME"), adminController.deleteShowtime.bind(adminController));

router.get("/halls", authenticate, adminMiddleware, audit("Hall", "LIST_HALLS"), adminController.listHalls.bind(adminController));
router.get("/halls/:id", authenticate, adminMiddleware, audit("Hall", "VIEW_HALL"), adminController.getHall.bind(adminController));
router.put("/halls/:id", authenticate, adminMiddleware, permission("hall:manage"), audit("Hall", "UPDATE_HALL"), adminController.updateHall.bind(adminController));
router.delete("/halls/:id", authenticate, adminMiddleware, permission("hall:manage"), audit("Hall", "DELETE_HALL"), adminController.deleteHall.bind(adminController));

export default router;

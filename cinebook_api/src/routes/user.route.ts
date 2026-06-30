import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

userRouter.put(
    "/update",
    authorizedMiddleware, // only logged in users can update profile -> req.user
    uploads.single("profileImage"), // handle profile image upload -> req.file
    userController.updateUser
);

userRouter.get(
    "/whoami",
    authorizedMiddleware,  // req.user -> logged in
    userController.whoami
); // get logged in user info  


userRouter.post(
    "/request-password-reset",
    userController.sendResetPasswordEmail
);

userRouter.post(
    "/reset-password/:token",
    userController.resetPassword
);

export default userRouter;
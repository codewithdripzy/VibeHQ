import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
	LoginController,
	RegisterController,
	LogoutController,
	SessionValidateController,
	GoogleController,
	GithubController,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/login").post(LoginController);
authRouter.route("/register").post(RegisterController);
authRouter.route("/continue/with/google").post(GoogleController);
authRouter.route("/continue/with/github").post(GithubController);

// session
authRouter.route("/logout").post(LogoutController);
authRouter.route("/session").get(authMiddleware, SessionValidateController);
authRouter.route("/check").get(authMiddleware, SessionValidateController);

export default authRouter;

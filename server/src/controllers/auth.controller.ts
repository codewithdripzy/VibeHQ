import { Response } from "express";
import { HTTP_RESPONSE_CODE } from "../core/constants/values";
import authService, { AuthServiceError } from "../services/auth.service";
import { AuthRequest } from "../core/middleware/auth.middleware";

const setAuthCookie = (res: Response, token: string) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
};

const LoginController = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.login({ email, password });

        setAuthCookie(res, token);

        return res.status(HTTP_RESPONSE_CODE.OK).json({
            message: `Welcome back, ${user.name}`,
            accessToken: token,
            user,
        });
    } catch (error: any) {
        if (error instanceof AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Login Error:", error);
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong during login" });
    }
};

const RegisterController = async (req: AuthRequest, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { token, user } = await authService.register({ firstName, lastName, email, password });

        setAuthCookie(res, token);

        return res.status(HTTP_RESPONSE_CODE.CREATED).json({
            message: "Your account has been created successfully",
            accessToken: token,
            user,
        });
    } catch (error: any) {
        if (error instanceof AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Register Error:", error);
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong during registration" });
    }
};

const LogoutController = async (req: AuthRequest, res: Response) => {
    res.clearCookie("accessToken");
    return res.status(HTTP_RESPONSE_CODE.OK).json({ message: "Logged out successfully" });
};

const SessionValidateController = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "Session is not valid" });
    }

    return res.status(HTTP_RESPONSE_CODE.OK).json({
        message: "Session is valid",
        user: req.user,
    });
};

const GoogleController = async (req: AuthRequest, res: Response) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ message: "Google ID token is required" });
        }

        const { token, user } = await authService.continueWithGoogle(idToken);
        setAuthCookie(res, token);

        return res.status(HTTP_RESPONSE_CODE.OK).json({
            message: `Welcome back, ${user.name}`,
            accessToken: token,
            user,
        });
    } catch (error: any) {
        if (error instanceof AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("Google Auth Error:", error);
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "Invalid or expired Google token" });
    }
};

const GithubController = async (req: AuthRequest, res: Response) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ message: "GitHub ID token is required" });
        }

        const { token, user } = await authService.continueWithGithub(idToken);
        setAuthCookie(res, token);

        return res.status(HTTP_RESPONSE_CODE.OK).json({
            message: `Welcome back, ${user.name}`,
            accessToken: token,
            user,
        });
    } catch (error: any) {
        if (error instanceof AuthServiceError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error("GitHub Auth Error:", error);
        return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).json({ message: "Invalid or expired GitHub token" });
    }
};

export {
    LoginController,
    RegisterController,
    GoogleController,
    GithubController,
    LogoutController,
    SessionValidateController,
};

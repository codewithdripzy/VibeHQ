import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import admin from "../config/firebase-admin";
import emailService from "./email.service";

export class AuthServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = "AuthServiceError";
        this.statusCode = statusCode;
    }
}

class AuthService {
    generateToken(user: any) {
        return jwt.sign(
            { id: user._id, uid: user.uid, role: user.role },
            process.env.JWT_SECRET || "vibehq-secret",
            { expiresIn: "24h" }
        );
    }

    private getDefaultOnboarding() {
        return [
            { task: "SELECT_ROLE", completed: false },
            { task: "SETUP_ACCOUNT", completed: false },
            { task: "VERIFY_IDENTITY", completed: false }
        ];
    }

    async login({ email, password }: any) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthServiceError("Invalid email or password", 401);
        }

        if (user.loginProvider !== "local") {
            throw new AuthServiceError(`This account is registered with ${user.loginProvider}. Please use social login.`, 400);
        }

        if (!user.password) {
            throw new AuthServiceError("Invalid email or password", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AuthServiceError("Invalid email or password", 401);
        }

        return {
            token: this.generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isFirstTime: user.isFirstTime,
            }
        };
    }

    async register({ firstName, lastName, email, password }: any) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AuthServiceError("User with this email already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            uid: uuidv4(),
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role: ["user"],
            loginProvider: "local",
            isFirstTime: true,
            onboardingStatus: this.getDefaultOnboarding()
        });

        void emailService.sendAccountVerificationEmail(user.email, user.name).catch(console.error);
        void emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);

        return {
            token: this.generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isFirstTime: true,
            }
        };
    }

    async continueWithGoogle(idToken: string) {
        return this.socialAuth(idToken, "google");
    }

    async continueWithGithub(idToken: string) {
        return this.socialAuth(idToken, "github");
    }

    private async socialAuth(idToken: string, provider: "google" | "github") {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { uid, email, name, picture } = decodedToken;

            let user = await User.findOne({ email });
            let isFirstTime = false;

            if (!user) {
                isFirstTime = true;
                user = await User.create({
                    uid,
                    email,
                    name: name || email?.split("@")[0] || "User",
                    avatar: picture,
                    role: ["user"],
                    loginProvider: provider,
                    isFirstTime: true,
                    onboardingStatus: this.getDefaultOnboarding()
                });
            } else {
                if (user.loginProvider !== provider) {
                    throw new AuthServiceError(`This email is already associated with ${user.loginProvider}. Please use that instead.`, 400);
                }

                isFirstTime = user.isFirstTime || false;
                user.avatar = picture || user.avatar;
                user.name = name || user.name;

                if (user.uid !== uid) {
                    user.uid = uid;
                }
                await user.save();
            }

            if (isFirstTime && user.email) {
                void emailService.sendAccountVerificationEmail(user.email, user.name).catch(console.error);
                void emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);
            }

            return {
                token: this.generateToken(user),
                user: {
                    id: user._id,
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    isFirstTime,
                }
            };
        } catch (error: any) {
            if (error instanceof AuthServiceError) throw error;
            console.error(`${provider} Auth Error:`, error);
            throw new AuthServiceError(`Invalid or expired ${provider} token`, 401);
        }
    }
}

export default new AuthService();

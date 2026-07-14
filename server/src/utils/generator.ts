import jwt from "jsonwebtoken";

export const generateTokens = (user: { id: string; email: string }) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "vibehq-secret",
        { expiresIn: "24h" }
    );
    return { accessToken };
};

import ApiService from "./api.service";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string[];
    avatar?: string;
    isFirstTime?: boolean;
}

interface AuthResponse {
    message: string;
    accessToken: string;
    user: User;
}

interface SessionResponse {
    message: string;
    user: User;
}

class AuthService extends ApiService {
    private static instance: AuthService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private setSession(accessToken: string, user: User) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
    }

    private clearSession() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }

    getStoredUser(): User | null {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    }

    isAuthenticated(): boolean {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("accessToken");
    }

    async login(email: string, password: string) {
        const { data } = await this.post<AuthResponse>("/api/auth/login", {
            email,
            password,
        });
        this.setSession(data.accessToken, data.user);
        return data;
    }

    async register(firstName: string, lastName: string, email: string, password: string) {
        const { data } = await this.post<AuthResponse>("/api/auth/register", {
            firstName,
            lastName,
            email,
            password,
        });
        this.setSession(data.accessToken, data.user);
        return data;
    }

    async continueWithGoogle(idToken: string) {
        const { data } = await this.post<AuthResponse>("/api/auth/continue/with/google", {
            idToken,
        });
        this.setSession(data.accessToken, data.user);
        return data;
    }

    async continueWithGithub(idToken: string) {
        const { data } = await this.post<AuthResponse>("/api/auth/continue/with/github", {
            idToken,
        });
        this.setSession(data.accessToken, data.user);
        return data;
    }

    async logout() {
        try {
            await this.post("/api/auth/logout");
        } finally {
            this.clearSession();
        }
    }

    async getSession() {
        const { data } = await this.get<SessionResponse>("/api/auth/session");
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    }
}

const authService = AuthService.getInstance();
export default authService;

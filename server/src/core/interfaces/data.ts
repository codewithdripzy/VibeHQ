export interface RequestUserData {
    _id: string;
    uid: string;
    name?: string;
    email?: string;
    role?: string[];
    avatar?: string;
    isFirstTime?: boolean;
}

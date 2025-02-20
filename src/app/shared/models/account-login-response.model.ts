export interface AccountLoginResponse {
    accessToken: string;
    email: string;
    isAdmin: boolean;
    expiresIn: number;
}
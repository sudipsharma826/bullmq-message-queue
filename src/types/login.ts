export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
    email: string;
    image: string;
    isAdmin: string;
    lastLogin: string;
}
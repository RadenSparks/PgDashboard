export interface SignInRequestDTO {
    email: string;
    password: string;
}

export interface SignInResponseDTO {
    access_token: string;
    username: string;
    role: string;
}
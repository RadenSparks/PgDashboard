export interface SignInRequestDTO {
    username: string;
    password: string;
}

export interface SignInResponseDTO {
    access_token: string;
    username: string;
    role: string;
}
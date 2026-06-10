export interface AuthSignInCredentials {
    email: string;
    password: string;
}

export interface AuthSignUpCredentials{
    name: string;
    displayName: string;
    email: string;
    password: string;
    passwordAgain: string;
}

export interface ResetPasswordCredentials{
    email: string;
}
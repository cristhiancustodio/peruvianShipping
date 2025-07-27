export interface CurrentUserType {
    username: string;
    userId: string;
    // Campos del primer JSON
    signInDetails?: { // Opcional, solo si viene del Cognito directo
        loginId: string;
        authFlowType: string;
    };
    'custom:rol'?: string; // Opcional, solo si viene del Cognito directo
    event_id?: string; // Opcional, solo si viene del Cognito directo
    // Campos comunes
    sub: string;
    email_verified: boolean;
    iss: string;
    'cognito:username': string;
    aud: string;
    token_use: string;
    auth_time: number;
    exp: number;
    iat: number;
    jti: string;
    email: string;

    // Campos específicos del segundo JSON
    at_hash?: string; // Opcional, solo si viene de Google via Cognito
    'cognito:groups'?: string[]; // Opcional, solo si viene de Google via Cognito
    given_name?: string; // Opcional, solo si viene de Google via Cognito
    nonce?: string; // Opcional, solo si viene de Google via Cognito
    picture?: string; // Opcional, solo si viene de Google via Cognito
    identities?: { // Opcional, solo si viene de Google via Cognito
        dateCreated: string;
        userId: string;
        providerName: string;
        providerType: string;
        issuer: string | null;
        primary: string;
    }[];
    name?: string; // Opcional, solo si viene de Google via Cognito
    family_name?: string; // Opcional, solo si viene de Google via Cognito

    // Campos 'origin_jti' renombrados para evitar colisiones
    origin_jti_cognito?: string; // Del primer JSON
    origin_jti_google?: string; // Del segundo JSON
}
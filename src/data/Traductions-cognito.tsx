const traducciones: Record<string, string> = {
    UsernameExistsException: "El usuario ya está registrado.",
    UserAlreadyAuthenticatedException: "El usuario ya está autenticado.",
    InvalidPasswordException: "Coloca una contraseña mas segura",
    InvalidParameterException: "Hay un parámetro inválido.",
    InvalidEmailRoleAccessPolicyException: "El correo o rol no es válido.",
    UserLambdaValidationException: "Validación fallida por función Lambda.",
    NotAuthorizedException: "Usuario o contraseña incorrecta",
    TooManyRequestsException: "Demasiados intentos. Intenta más tarde.",
    LimitExceededException: "Se ha alcanzado el límite de intentos.",
    ExpiredCodeException: "El código de verificación ha expirado.",
    default: "Ocurrió un error al registrar el usuario.",
}

export const getTraductionCognito = (error: string) => {
    const mensaje = traducciones[error] || traducciones.default;
    return mensaje;
}
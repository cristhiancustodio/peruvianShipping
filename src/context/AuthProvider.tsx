import { createContext, useEffect, useState } from "react";
import { AuthSession, fetchAuthSession, getCurrentUser, GetCurrentUserOutput, signIn, signOut } from "@aws-amplify/auth";
import LoadingPage from "@/view/layout/PageMessages/LoadingPage";
import { getTraductionCognito } from "@/data/Traductions-cognito";

type AuthContextType = {
    currentUser: GetCurrentUserOutput;
    session: AuthSession;
    isLoading: boolean;
    isAuthenticated: boolean;
    startSession: (username: string, password: string) => Promise<boolean>;
    closeSession: () => Promise<void>;
    errors: any
}

export const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<GetCurrentUserOutput>(null!);
    const [session, setSession] = useState<AuthSession>(null!);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //const [isConfirmed, setIsConfirmed] = useState(false); //necesitamos verificar si esta confirmado el correo
    const [errors, setError] = useState('');

    const startSession = async (username: string, password: string) => {
        try {
            await signIn({
                username: username,
                password: password
            });
            setIsAuthenticated(true);
            return true;
        } catch (error: any) {
            setIsAuthenticated(false);
            setError(getTraductionCognito(error.name));
            return false;
        }
    }
    const closeSession = async () => {
        try {
            await signOut();
            setIsAuthenticated(false);
        } catch (error: any) {
            setError(getTraductionCognito(error.name));
        } finally {
            setIsAuthenticated(false);
            setCurrentUser(null!);
            setSession(null!);
        }

    }
    const verifySession = async () => {
        try {
            setIsLoading(true);
            const [userResult, sessionResult] = await Promise.allSettled([
                getCurrentUser(),
                fetchAuthSession()
            ]);
            if (userResult.status === 'fulfilled') {
                const { username, signInDetails, userId } = userResult.value;

                let completeUserInfo = {
                    username,
                    userId,
                    signInDetails,
                };

                // Procesar sesión y extraer toda la información del token
                if (sessionResult.status === 'fulfilled' && sessionResult.value.tokens) {
                    setSession(sessionResult.value);

                    // Extraer toda la información del ID Token
                    const idToken = sessionResult.value.tokens.idToken;
                    if (idToken) {
                        const tokenPayload = idToken.payload;                        
                        // Combinar toda la información disponible
                        completeUserInfo = {
                            ...completeUserInfo,
                            ...tokenPayload
                        };
                    }
                } else {
                    setSession(null!);
                }

                setCurrentUser(completeUserInfo);
                setIsAuthenticated(true);

            } else {
                setIsAuthenticated(false);
                setCurrentUser(null!);
                setSession(null!);
            }
        } catch (error) {
            console.error("Error al verificar la sesión:", error);
            setIsAuthenticated(false);
            setCurrentUser(null!);
            setSession(null!);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        verifySession();
    }, [])

    if (isLoading) {
        return <LoadingPage />
    }


    return (
        <AuthContext.Provider value={{ errors, currentUser, session, isLoading, startSession, closeSession, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;
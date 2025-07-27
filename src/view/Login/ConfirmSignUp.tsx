import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getTraductionCognito } from "@/data/Traductions-cognito";
import { confirmSignUp } from "@aws-amplify/auth";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router";

export default function ConfirmSignUpComponent({ email, username }: { email: string, username: string }) {

    const [code, setCode] = useState('');

    const [isTransition, setTransition] = useTransition();
    const [isComplete, setComplete] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setTransition(async () => {
            try {
                const res = await confirmSignUp({
                    username: username,
                    confirmationCode: code
                });
                if (res.isSignUpComplete) {
                    setComplete(true);

                    setTimeout(() => {
                        navigate("/auth/login");
                    }, 2000);
                }
            } catch (error: any) {
                const mensaje = getTraductionCognito(error.name) || "Ocurrió un error al confirmar el registro.";
                setError(mensaje);
                console.log(error.name, error.message);
            }
        })
    }
    return (
        <Card>
            <CardHeader className="text-center">
                {
                    isComplete && <p className="text-md bg-green-300 rounded p-1">¡Registro completado!</p>
                }
                {
                    error && <p className="text-md bg-red-300 rounded p-1">{error}</p>
                }
                <CardTitle className="text-xl">Confirma tu cuenta</CardTitle>
                <CardDescription>
                    Hemos enviado un código de verificación a tu correo electrónico {email}.
                    Por favor, ingresa el código para confirmar tu cuenta y completar el registro.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4">
                        <InputOTP maxLength={6}
                            value={code}
                            onChange={(value) => setCode(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button type="submit" className="w-full" disabled={isTransition || code.length < 6 || isComplete}>
                        {
                            isTransition && <Loader2 className="animate-spin"></Loader2>
                        }
                        Confirmar</Button>
                </form>
            </CardContent>
        </Card>
    )
}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NavLink } from "react-router"
import { signUp } from "aws-amplify/auth"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import ConfirmSignUpComponent from "./ConfirmSignUp"
import ButtonGoogle from "./ButtonGoogle"
import { getTraductionCognito } from "@/data/Traductions-cognito"
export function Register() {

    const [error, setError] = useState('');
    const [isTransition, setTransition] = useTransition();

    const [confirm, setConfirm] = useState<any>(undefined);

    const [username, setUsername] = useState('');


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setTransition(async () => {
            try {
                const formData = new FormData(event.currentTarget)
                const email = formData.get("email")?.toString()!;
                const username = formData.get("username")?.toString()!;
                const password = formData.get("password")?.toString()!;
                setUsername(username);
                const { nextStep } = await signUp({
                    username: username,
                    password: password,
                    options: {
                        userAttributes: {
                            email: email,
                            "custom:rol": "Administrador"
                        },
                    }
                });
                if (nextStep.signUpStep == "CONFIRM_SIGN_UP") {
                    setConfirm(nextStep)
                }
            } catch (err: any) {
                const mensaje = getTraductionCognito(err.name) || "Ocurrió un error al confirmar el registro.";
                setError(mensaje);

            }
        });
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                {
                    confirm
                        ? <ConfirmSignUpComponent email={confirm.codeDeliveryDetails.destination} username={username}></ConfirmSignUpComponent>
                        :
                        <div className="flex flex-col gap-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl">Bienvenido</CardTitle>
                                    <CardDescription>
                                        Registrate con tu cuenta de Google
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-6">
                                            <div className="flex flex-col gap-4">
                                                <ButtonGoogle></ButtonGoogle>
                                            </div>
                                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                                    O continua con
                                                </span>
                                            </div>
                                            <div className="">
                                                {error && (
                                                    <div className="text-red-500 text-sm text-center bg-red-300 rounded-md p-1 border border-red-500">
                                                        {error}
                                                    </div>
                                                )}

                                            </div>
                                            <div className="grid gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="username">Usuario</Label>
                                                    <Input
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        value={username}
                                                        id="username"
                                                        name="username"
                                                        type="text"
                                                        placeholder=""
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex items-center">
                                                        <Label htmlFor="password">Contraseña</Label>
                                                    </div>
                                                    <Input id="password" name="password" type="password" required />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={isTransition}>
                                                    {
                                                        isTransition && <Loader2 className="animate-spin"></Loader2>
                                                    }
                                                    Registrate
                                                </Button>
                                            </div>
                                            <div className="text-center text-sm">
                                                Tienes una cuenta?{" "}
                                                <NavLink to="/auth/login" className="underline underline-offset-4">

                                                    Ingresa
                                                </NavLink>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                }
            </div>
        </div>
    )
}

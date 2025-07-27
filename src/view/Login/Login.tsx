import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from "react-router"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"
import ButtonGoogle from "./ButtonGoogle"
import useAuth from "@/hook/useAuth"

export function LoginForm() {
	

	const [isTransitioning, setIsTransitioning] = useTransition();
	const { startSession, errors } = useAuth();
	const navigate = useNavigate();
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

		setIsTransitioning(async () => {
			try {
				event.preventDefault()
				const formData = new FormData(event.currentTarget)
				const username = formData.get("username")?.toString()!;
				const password = formData.get("password")?.toString()!;
				const res = await startSession(username, password);

				if (res) {
					navigate("/");
				}
			} catch (error: any) {
				
			}
		})
	}
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Bienvenido</CardTitle>
							<CardDescription>
								Ingresa con tu cuenta de Google
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
										{errors && (
											<div className="text-red-500 text-sm text-center bg-red-300 rounded-md p-1 border border-red-500">
												{errors}
											</div>
										)}
									</div>
									<div className="grid gap-6">
										<div className="grid gap-2">
											<Label htmlFor="username">Usuario</Label>
											<Input
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
										<Button type="submit" className="w-full" disabled={isTransitioning}>
											{
												isTransitioning && <Loader2 className="animate-spin"></Loader2>
											}
											Login
										</Button>
									</div>
									<div className="text-center text-sm">
										No tienes una cuenta?{" "}
										<NavLink to="/auth/signUp" replace className="underline underline-offset-4">
											Registrate
										</NavLink>
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

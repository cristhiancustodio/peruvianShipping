import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { listMenu } from "@/data/listMenu"
import useAuth from "@/hook/useAuth";
import { NavLink } from "react-router"


export function Navigation() {

    const { session } = useAuth();
    const { closeSession } = useAuth();
    return (
        <div className="flex justify-between m-2">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        {
                            listMenu.map((item) => (
                                <NavigationMenuLink key={item.name} asChild className={navigationMenuTriggerStyle()}>
                                    <NavLink to={item.rout}>
                                        {item.name}
                                    </NavLink>
                                </NavigationMenuLink>
                            ))
                        }
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem className="space-x-2">
                        {
                            !session?.tokens?.idToken?.toString() ?
                                <>
                                    <NavLink to="/auth/login">
                                        <Button>Ingresar</Button>
                                    </NavLink>

                                    <NavLink to="/auth/signUp">
                                        <Button variant={"outline"}>Registrate</Button>
                                    </NavLink>
                                </>
                                :
                                <>
                                    <Button onClick={closeSession}>
                                        Cerrar Sesion
                                    </Button>
                                </>
                        }
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu >
        </div>
    )
}

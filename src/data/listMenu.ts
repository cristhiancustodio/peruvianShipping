type MenuProps = {
    name: string;
    rout: string;
    children?: MenuProps[];
}
export const listMenu: MenuProps[] = [
    {
        name: "Inicio",
        rout: '/'
    },
    {
        name: "Interacciones",
        rout: '/interacciones'
    },
    {
        name: "Logistica",
        rout: '/logistica'
    },
    {
        name: "Mentores",
        rout: '/mentores',
        children: [],
    },
    {
        name: "Suscripción",
        rout: '/suscripcion',
        children: [],
    }
];
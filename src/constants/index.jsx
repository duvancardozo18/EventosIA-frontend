import { Home, Calendar, ClipboardList, HelpCircle } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Inicio",
                icon: Home,
                path: "inicio",
            },
            {
                label: "Eventos",
                icon: Calendar,
                path: "events",
            },
            {
                label: "Reportes",
                icon: ClipboardList,
                path: "reports",
            },
            {
                label: "Ayuda",
                icon: HelpCircle,
                path: "help",
            },
        ],
    }
];

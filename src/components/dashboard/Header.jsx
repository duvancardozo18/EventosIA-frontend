import { Bell, ChevronsLeft } from "lucide-react";
import PropTypes from "prop-types";
import { CgProfile } from "react-icons/cg";

export const Header = ({ collapsed, setCollapsed }) => {

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-sm transition-colors">
            {/* Botón de colapso */}
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Controles del usuario */}
            <div className="flex items-center gap-x-5">

                {/* Botón de notificaciones */}
                <button className="items-center btn-ghost size-10">
                    <Bell size={20} />
                </button>

                {/* Perfil */}
                <button className="overflow-hidden rounded-full size-10">
                    <CgProfile size={24} />
                </button>
            </div>
        </header>
    );
};

// Definición de tipos para props
Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};

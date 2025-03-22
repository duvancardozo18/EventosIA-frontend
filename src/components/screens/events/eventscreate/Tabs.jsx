import { useLocation } from "react-router-dom";

const Tabs = ({ sections, disabled }) => {
  const location = useLocation();

  // Función desactivada para evitar cambios de tab en select
  const handleSelectChange = (event) => {
    if (!disabled) {
      navigate(event.target.value);
    }
  };

  return (
    <div>
      {/* Tabs en pantallas grandes */}
      <div className="hidden md:flex items-center justify-center gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <a
              key={section.id}
              disabled={disabled} // Deshabilita el botón
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                location.pathname === section.path
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 "
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`} // Bloquea visualmente
            >
              {Icon && <Icon className="h-5 w-5" />}
              {section.name}
            </a>
          );
        })}
      </div>

      {/* Select en pantallas pequeñas */}
      <div className="md:hidden flex justify-center">
        <select
          value={location.pathname}
          onChange={handleSelectChange}
          disabled={disabled} // Deshabilita el select en móvil
          className="p-2 border border-gray-300 rounded-md w-full max-w-[90%] sm:max-w-[75%] lg:max-w-xs text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sections.map((section) => (
            <option key={section.id} value={section.path}>
              {section.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tabs;
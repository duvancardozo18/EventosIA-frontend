import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Tabs from "./tabs/Tabs";

// Configuración de secciones
const sections = [
  { id: "evento", name: "Evento", path: "evento" },
  { id: "tipoEvento", name: "Tipo Evento", path: "tipoEvento" },
  { id: "ubicacion", name: "Ubicación", path: "ubicacion" }
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado inicial del formulario
  const [formData, setFormData] = useState({ evento: {} });
  const [completedSections, setCompletedSections] = useState({});

  // Función para actualizar datos de formulario
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  // Marcar sección como completada
  const markSectionCompleted = (section) => {
    setCompletedSections(prev => ({ ...prev, [section]: true }));
  };

  // Navegar a la sección anterior
  const goToPreviousSection = () => {
    const currentPath = location.pathname.split('/').pop();
    const currentIndex = sections.findIndex(s => s.path === currentPath);
    if (currentIndex > 0) {
      navigate(sections[currentIndex - 1].path);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <Tabs 
          sections={sections} 
          currentPath={location.pathname.split('/').pop()}
          completed={completedSections}
        />
      </div>

      <div className="flex-grow p-4">
        <Outlet 
          context={{ 
            formData,
            updateFormData,
            markSectionCompleted,
            goToPreviousSection,
            currentSection: location.pathname.split('/').pop()
          }} 
        />
      </div>
    </div>
  );
};

export default CreateEvent;
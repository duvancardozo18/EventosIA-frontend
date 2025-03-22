import { useNavigate } from "react-router-dom";

const sections = [
  { id: "evento", name: "Evento", path: "/dashboard/events/create-event/evento" },
  { id: "tipoEvento", name: "Tipo Evento", path: "/dashboard/events/create-event/tipoEvento" },
  { id: "ubicacion", name: "Ubicación", path: "/dashboard/events/create-event/ubicacion" },
  { id: "participantes", name: "Participantes", path: "/dashboard/events/create-event/participantes" },
  { id: "alimentacion", name: "Alimentación", path: "/dashboard/events/create-event/alimentacion" },
  { id: "recursos", name: "Recursos", path: "/dashboard/events/create-event/recursos" },
];

const useTabNavigation = (currentSectionId) => {
  const navigate = useNavigate();

  // Obtener el índice de la sección actual
  const currentIndex = sections.findIndex((section) => section.id === currentSectionId);

  // Función para navegar a la siguiente sección
  const goToNextSection = () => {
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(nextSection.path);
    }
  };

  // Función para navegar a la sección anterior
  const goToPreviousSection = () => {
    if (currentIndex > 0) {
      const previousSection = sections[currentIndex - 1];
      navigate(previousSection.path);
    }
  };

  // Determinar si el botón "Retroceder" debe mostrarse
  const showPreviousButton = currentIndex > 0;

  // Determinar si el botón "Siguiente" debe mostrarse
  const showNextButton = currentIndex < sections.length - 1;

  return {
    goToNextSection,
    goToPreviousSection,
    showPreviousButton,
    showNextButton,
  };
};

export default useTabNavigation;
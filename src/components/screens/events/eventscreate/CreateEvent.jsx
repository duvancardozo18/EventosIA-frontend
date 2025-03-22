import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Tabs from "./Tabs";

const sections = [
  { id: "evento", name: "Evento", path: "/dashboard/events/create-event/evento" },
  { id: "tipoEvento", name: "Tipo Evento", path: "/dashboard/events/create-event/tipoEvento" },
  { id: "ubicacion", name: "Ubicación", path: "/dashboard/events/create-event/ubicacion" },
  { id: "participantes", name: "Participantes", path: "/dashboard/events/create-event/participantes" },
  { id: "alimentacion", name: "Alimentación", path: "/dashboard/events/create-event/alimentacion" },
  { id: "recursos", name: "Recursos", path: "/dashboard/events/create-event/recursos" },
];

const CreateEvent = () => {
    const [formData, setFormData] = useState({
      evento: {
        name: "", // Nombre del evento
        event_state_id: 1, // Estado predeterminado (por ejemplo, "Activo")
        type_of_event_id: null, // Tipo de evento (se seleccionará en el formulario)
        location_id: null, // Ubicación (se seleccionará en el formulario)
        user_id_created_by: null, // ID del usuario que crea el evento (se obtendrá del contexto de autenticación)
        image: null, // Imagen del evento
      },
      tipoEvento: {
        event_type: "", // Nombre del tipo de evento
        description: "", // Descripción del evento
        max_Participants: null, // Número máximo de participantes
        video_Conference_Link: "", // Enlace de videoconferencia (si es virtual)
        price: null, // Precio del evento
        start_time: null, // Hora de inicio
        end_time: null, // Hora de finalización
      },
      ubicacion: {
        name: "",
        description: "",
        price: null,
        address: "",
      },
      participantes: {
        user_email: "",
        participant_email: "",
        event_id: null,
        participant_status_id: null,
      },
      alimentacion: {
        name: "",
        description: "",
        quantity_available: null,
        price: null,
      },
      recursos: {
        name: "",
        description: "",
        quantity_available: null,
        price: null,
      },
    });

    const navigate = useNavigate();

    // Actualizar datos de la sección
    const updateFormData = (section, data) => {
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...data }, // Actualiza solo la sección correspondiente
        }));
    };

    // Navegar a la siguiente sección
    const goToNextSection = (currentSection) => {
        const currentIndex = sections.findIndex((section) => section.id === currentSection);
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            navigate(nextSection.path); // Navegar a la siguiente sección
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Barra de navegación con tabs */}
            <div className="sticky top-0 z-10 bg-white shadow-md p-4">
                <Tabs sections={sections} />
            </div>

            {/* Contenedor donde se renderiza la vista actual */}
            <div className="flex-grow p-4">
              <Outlet context={{ updateFormData, formData, goToNextSection }} /> {/* Pasa el contexto */}
            </div>
        </div>
    );
};

export default CreateEvent;
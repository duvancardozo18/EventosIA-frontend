import { useState, useEffect } from "react";
import ModalEvent from "../../ui/ModalEvent";
import EventCards from "../../ui/EventCards";
import { useNavigate } from "react-router-dom";

const CardsView = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("myEvents");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchUser = async () => {
      const userData = {
        id: 1, 
        role: "manager", // Cambia a "user" para probar el otro rol
        permissions: ["view_events", "edit_events", "create_events", "delete_events"], // Permisos del gestor
      };
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    setTimeout(() => {
      const myEvents = [
        { id_event: 1, name: "Evento 1", event_state_id: "Activo", location_id: "Madrid", type_of_event_id: "Conferencia", created_by: 1 },
        { id_event: 2, name: "Evento 2", event_state_id: "Activo", location_id: "Madrid", type_of_event_id: "Conferencia", created_by: 1 },
        { id_event: 3, name: "Evento 3", event_state_id: "Activo", location_id: "Madrid", type_of_event_id: "Conferencia", created_by: 1 }
      ];
      const invitedEvents = [
        { id_event: 4, name: "Evento 4", event_state_id: "Pendiente", location_id: "Barcelona", type_of_event_id: "Taller", created_by: 2 },
      ];

      setEvents(viewType === "myEvents" ? myEvents : invitedEvents);
      setIsLoading(false);
    }, 300);
  }, [user, viewType]);

  const handleEdit = (eventId) => {
    console.log(`Editar evento con ID: ${eventId}`);
  };

  const handleDelete = (eventId) => {
    console.log(`Eliminar evento con ID: ${eventId}`);
  };

  const handleCardClick = (eventData) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };



  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-center">
        Eventos ({user?.role === "manager" ? "Gestor" : "Usuario"})
      </h2>

      {/* Mostrar botones de "Mis eventos" y "Eventos invitados" solo si el usuario es "user" */}
      {user?.role === "user" && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 font-semibold rounded-lg shadow-md transition ${viewType === "myEvents" ? "bg-gradient-to-r from-blue-300 to-purple-200 text-white" : ""}`}
            onClick={() => setViewType("myEvents")}
          >
            Mis eventos
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-lg shadow-md transition ${viewType === "invitedEvents" ? "bg-gradient-to-r from-blue-300 to-purple-200 text-white" : ""}`}
            onClick={() => setViewType("invitedEvents")}
          >
            Eventos invitados
          </button>
        </div>
      )}

      {/* Mostrar botón de "Crear Evento" solo si el usuario es "manager" */}
      {user?.role === "manager" && (
        <div className="flex justify-center mb-6">
          <button 
            className="px-6 py-2 font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition shadow-md overflow-hidden 
                    hover:shadow-lg hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("create-event")} // Redirige a la vista protegida
          >
            Crear Evento
          </button>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-300 to-blue-400 shadow-lg rounded-lg p-6 mx-auto max-w-6xl w-full flex-grow border-b border-gray-300 min-h-[400px] overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center animate-pulse">Cargando eventos...</p>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity duration-300">
            {events.map(event => (
              <EventCards 
                key={event.id_event}
                id_event={event.id_event}
                {...event}
                role={user.role} 
                onCardClick={handleCardClick}
                onEdit={user.role === "manager" ? handleEdit : null} 
                onDelete={user.role === "manager" ? handleDelete : null} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No hay eventos disponibles.</p>
        )}
      </div>

      <ModalEvent 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        event={selectedEvent} 
        isAdmin={false}  
      />
    </div>
  );
};

export default CardsView;
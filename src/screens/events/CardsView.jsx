import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EventCards from "../../components/events/EventCards";
import ModalEvent from "../../components/events/ModalEvent";
import axios from "axios";
import { AuthContext } from "../../config/AuthProvider"; // Import the AuthContext

const CardsView = () => {
  // Use the AuthContext instead of managing user state locally
  const { userId, role, permissions, isAuthenticated, loading } = useContext(AuthContext);

  console.log("AuthContext values:", {
    userId,
    role, // Aquí verás si tu rol es realmente "admin"
    permissions, // Aquí verás qué permisos tienes
    isAuthenticated,
    loading
  });
  
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("myEvents");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  // Check if user is authorized to manage events (is admin/manager)
  const isManager = role === "SuperAdmin" || role === "admin";
  const canEditEvents = permissions.includes("edit_events");
  const canDeleteEvents = permissions.includes("delete_events");
  const canCreateEvents = permissions.includes("create_events");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!userId || loading) return;

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Use different endpoints based on view type
        const endpoint = viewType === "myEvents" 
          ? `/events?created_by=${userId}` 
          : `/events/invited/${userId}`;
        
        console.log(`Fetching from: ${API_URL}${endpoint}`);
        const response = await axios.get(`${API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        console.log('Events response:', response.data);
        setEvents(response.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId, viewType, API_URL, isAuthenticated, loading, navigate]);

  const handleEdit = (eventId) => {
    console.log(`Editar evento con ID: ${eventId}`);
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    console.log(`Eliminar evento con ID: ${eventId}`);
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await axios.delete(`${API_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        // Update the events list after deletion
        setEvents(events.filter(event => event.id_event !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('No se pudo eliminar el evento. Inténtalo de nuevo.');
      }
    }
  };

  const handleCardClick = (eventData) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-gray-600 text-center animate-pulse">Cargando...</p>
    </div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-center">
        Eventos ({isManager ? "Gestor" : "Usuario"})
      </h2>

      {/* Show "My Events" and "Invited Events" buttons only for regular users */}
      {!isManager && (
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

      {/* Show "Create Event" button only for managers with create permissions */}
      {isManager && canCreateEvents && (
        <div className="flex justify-center mb-6">
          <button 
            className="px-6 py-2 font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 transition shadow-md overflow-hidden 
                    hover:shadow-lg hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/create-event")}
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
                name={event.name}
                event_state_id={event.state}
                location_id={event.location || "Sin ubicación"}
                type_of_event_id={event.event_type}
                created_by={event.user_id_created_by}
                image_url={event.image_url}
                role={role} 
                onCardClick={handleCardClick}
                onEdit={isManager && canEditEvents ? handleEdit : null} 
                onDelete={isManager && canDeleteEvents ? handleDelete : null} 
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
        isAdmin={isManager}  
      />
    </div>
  );
};

export default CardsView;
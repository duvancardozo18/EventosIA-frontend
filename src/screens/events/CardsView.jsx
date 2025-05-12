"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../config/AxiosInstance"
import { useContext } from "react"
import { AuthContext } from "../../config/AuthProvider"
import { Calendar, Search } from "lucide-react"

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userId, email, isAuthenticated } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Todos")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem("access_token")
        if (!token) {
          console.log("No hay token disponible")
          setError("No has iniciado sesión. Por favor, inicia sesión para ver tus eventos.")
          setLoading(false)
          return
        }

        // Verificar si tenemos userId
        if (!userId) {
          console.log("No hay ID de usuario disponible")
          setError("No se pudo identificar al usuario. Por favor, espera un momento.")
          setLoading(false)
          return
        }

        console.log("Intentando obtener eventos para el usuario ID:", userId)
        setLoading(true)

        // Usar la ruta correcta del backend para obtener los eventos del usuario
        // La ruta correcta es /events/users/:id según el router del backend
        const response = await axiosInstance.get(`/events/users/${userId}`)
        console.log("Respuesta de eventos:", response.data)
        setMyEvents(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching my events:", err)

        if (err.response) {
          console.error("Error response:", err.response.status, err.response.data)

          if (err.response.status === 401) {
            setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
          } else {
            setError(`Error al cargar eventos: ${err.response.data.error || "Error desconocido"}`)
          }
        } else if (err.request) {
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
        } else {
          setError("No se pudieron cargar tus eventos. Por favor, intenta de nuevo más tarde.")
        }
      } finally {
        setLoading(false)
      }
    }

    // Solo ejecutar si el usuario está autenticado
    if (isAuthenticated && userId) {
      fetchEvents()
    } else {
      setLoading(false)
      setError("Debes iniciar sesión para ver tus eventos.")
    }
  }, [userId, isAuthenticated])

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Fecha inválida"

      const day = date.getDate()
      const month = date.toLocaleString("es-ES", { month: "short" }).toUpperCase()
      const weekday = date.toLocaleString("es-ES", { weekday: "short" }).toUpperCase()
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")

      return `${day} ${month} - ${weekday} - ${hours}:${minutes}`
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return "Error en fecha"
    }
  }

  // Filtrado de eventos con validación
  const filteredEvents = myEvents.filter((event) => {
    // Validar que event y sus propiedades existan
    if (!event) return false

    const eventName = event.name || event.event_name || ""
    const eventRole = event.user_role || ""

    const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = activeFilter === "Todos" || eventRole.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#365486]"></div>
        <p className="ml-2">Cargando eventos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#365486] text-white px-4 py-2 rounded-lg hover:bg-[#4a6da8] transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#365486]">Mis Eventos</h1>
        <button
          onClick={() => (window.location.href = "/dashboard/events/create-event")}
          className="px-6 py-2 font-semibold rounded-lg shadow-md bg-[#365486] text-white hover:bg-[#4a6da8] transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Crear Evento
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#365486]" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#365486]"
        />
      </div>

      {/* Filtros de rol con opción "Todos" */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {["Todos", "Gestor", "participante", "cliente"].map((role) => (
          <button
            key={role}
            className={`px-6 py-2 rounded-full ${
              activeFilter === role ? "bg-[#365486] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Más recientes</h2>

      {filteredEvents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No tienes eventos con este filtro</h3>
          <p className="text-gray-500 mb-4">Prueba con otro filtro o crea un nuevo evento.</p>
          <a
            href="/dashboard/events/create-event"
            className="inline-block bg-[#365486] text-white px-4 py-2 rounded-lg hover:bg-[#4a6da8] transition-colors"
          >
            Crear un evento
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id_event}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gray-200 relative">
                {event.image_url && Array.isArray(event.image_url) && event.image_url.length > 0 ? (
                  <img
                    src={event.image_url[0] || "/placeholder.svg"}
                    alt={event.name || event.event_name}
                    className="w-full h-full object-cover"
                  />
                ) : event.image ? (
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name || event.event_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f0f5fb]">
                    <Calendar className="text-[#365486] opacity-50" size={48} />
                  </div>
                )}
                {event.state && (
                  <div className="absolute top-2 right-2 bg-[#365486] text-white text-xs px-2 py-1 rounded">
                    {event.state}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[#365486] text-sm font-medium mb-1">{formatDate(event.start_time || event.date)}</p>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{event.name || event.event_name}</h3>
                <p className="text-gray-700 line-clamp-2 mb-3">{event.event_type_description || event.description}</p>
                <div className="flex justify-end">
                  <a
                    href={`/dashboard/events/detail-events/${event.id_event}`}
                    className="text-[#365486] hover:text-[#4a6da8] font-medium text-sm"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEvents

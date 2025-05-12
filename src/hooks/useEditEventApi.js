import axios from "axios";
import { toast } from "react-toastify";

export const useEditEventAPI = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    if (body) {
      options.data = body;
      console.groupCollapsed(`[API Request] ${method} ${endpoint}`);
      console.log("Payload:", body);
      console.log("Headers:", options.headers);
      console.groupEnd();
    }

    try {
      const response = await axios(`${API_URL}${endpoint}`, options);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message || 'Error en la solicitud');
      }

      return response.data;
    } catch (error) {
      console.error('[API Error]', error);
      throw error;
    }
  };

  const updateTypeEvent = async (typeEventId, updated) => {
    console.log("[Update Type Event] ID:", typeEventId);
    console.group("[Update Type Event]");
    console.log("Endpoint: /types-of-event/" + typeEventId);
    console.log("Payload:", updated);
    console.groupEnd();

    return fetchApi(`/types-of-event/${typeEventId}`, 'PUT', updated);
  };

  const updateLocation = async (locationId, locationData) => {
    const data = {
      name: locationData.name,
      description: locationData.description,
      price: locationData.price,
      address: locationData.address
    };

    console.group("[Update Location]");
    console.log("Endpoint: /locations/" + locationId);
    console.log("Payload:", data);
    console.groupEnd();

    return fetchApi(`/locations/${locationId}`, 'PUT', data);
  };

  const updateMainEvent = async (eventId, eventData, typeEventId, locationId) => {
    const formData = new FormData();
    formData.append('name', eventData.name);
    formData.append('event_state_id', eventData.event_state_id);

    if (typeEventId) formData.append('type_of_event_id', typeEventId);
    if (locationId) formData.append('location_id', locationId);
    if (eventData.image instanceof File) formData.append('image', eventData.image);

    console.group("[Update Main Event]");
    console.log("Endpoint:", `${API_URL}/events/${eventId}`);
    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name})` : value);
    }
    console.groupEnd();

    const response = await axios.put(`${API_URL}/events/${eventId}`, formData, {
      credentials: 'include',
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || 'Error al actualizar el evento');
    }

    return response.data;
  };

  const updateCompleteEvent = async (
    eventId,
    eventData,
    originalTypeEventData,
    updatedTypeEventData,
    locationData
  ) => {
    try {
      let typeEventId = null;
      let locationId = null;
      let allUpdatesSuccessful = true;

      // Actualizar tipo de evento si hay cambios
      if (updatedTypeEventData && originalTypeEventData?.id_type_of_event) {
        typeEventId = originalTypeEventData.id_type_of_event;
        await updateTypeEvent(typeEventId, updatedTypeEventData);
      }

      // Actualizar ubicación si existe
      if (locationData?.id) {
        await updateLocation(locationData.id, locationData);
        locationId = locationData.id;
      }

      // Actualizar evento principal
      await updateMainEvent(eventId, eventData, typeEventId, locationId);

      return { 
        success: true, 
        eventId 
      };

    } catch (error) {
      console.error("Error actualizando el evento:", error);
      toast.error(error.message || "Ocurrió un error al actualizar el evento");
      return { 
        success: false 
      };
    }
  };

  const getEventById = async (eventId) => {
    try {
      console.log("[Get Event By ID]:", eventId);
      const response = await fetchApi(`/events/${eventId}`);
      return response;
    } catch (error) {
      toast.error('No se pudo cargar el evento');
      throw error;
    }
  };

  return {
    updateTypeEvent,
    updateLocation,
    updateMainEvent,
    updateCompleteEvent,
    getEventById
  };
};
import axios from "axios"; // Importar axios
import { useState } from "react";

export const useEventAPI = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [isCreating, setIsCreating] = useState(false);

    // Función genérica para llamadas API con axios
    const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
        console.log(API_URL);
        console.groupCollapsed(`[API] ${method} ${endpoint}`);
        console.log('Request payload:', body);
        console.log('Request headers:', headers);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        };

        // Si hay un cuerpo, se agrega al request
        if (body) {
            options.data = body;
        }

        try {
            // Realizamos la petición con axios
            const response = await axios(`${API_URL}${endpoint}`, options);

            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            // Consideramos 201 como éxito también
            if (response.status !== 200 && response.status !== 201) {
                console.error('API Error:', response.data.message || 'Error en la solicitud');
                throw new Error(response.data.message || 'Error en la solicitud');
            }

            return response.data;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        } finally {
            console.groupEnd();
        }
    };

    // Para el tipo de evento
    const createTypeEvent = async (typeEventData) => {
        if (!typeEventData) {
            console.log('[Event Type] No data provided, skipping creation');
            return null;
        }

        console.group('[Event Type] Creating event type');
        try {
            setIsCreating(true);

            // Log de los datos antes de la transformación
            console.log('[Event Type] Raw data:', typeEventData);

            const transformedData = {
                id_type_of_event: null,
                event_type: typeEventData.event_type,
                description: typeEventData.description,
                max_participants: typeEventData.max_Participants,
                video_Conference_Link: typeEventData.video_Conference_Link,
                price: typeEventData.price,
                start_time: typeEventData.start_time,
                end_time: typeEventData.end_time,
                category_id: typeEventData.category_id
            };

            // Log de los datos transformados
            console.log('[Event Type] Transformed data:', transformedData);

            // Realizamos la solicitud con axios
            const response = await fetchApi('/types-of-event', 'POST', transformedData);

            console.log('Created event type with ID:', response.id_type_of_event);
            return response.id_type_of_event;
        } catch (error) {
            console.error('Error creating event type:', error);
            alert(error.message || 'Error al crear el tipo de evento');
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Para la ubicación
    const createLocation = async (locationData) => {
        console.group('[Location] Creating location');
        try {
            setIsCreating(true);

            console.log('[Location] Raw data:', locationData);

            const transformedData = {
                name: locationData.name,
                description: locationData.description,
                price: locationData.price,
                address: locationData.address
            };

            console.log('[Location] Transformed data:', transformedData);

            const response = await fetchApi('/locations', 'POST', transformedData);

            console.log('Created location with ID:', response.id_location);
            return response.id_location;
        } catch (error) {
            console.error('Error creating location:', error);
            alert(error.message || 'Error al crear la ubicación');
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Crear evento principal - con los IDs de tipo de evento y ubicación
    const createMainEvent = async (eventData, typeEventId, locationId) => {
        console.group('[Main Event] Creating main event');
        try {
            setIsCreating(true);

            console.log('[Main Event] Raw event data:', eventData);
            console.log('[Main Event] Type event ID:', typeEventId);
            console.log('[Main Event] Location ID:', locationId);

            const formData = new FormData();
            formData.append('name', eventData.name);
            formData.append('event_state_id', eventData.event_state_id);
            formData.append('user_id_created_by', eventData.user_created_by);

            // Se agrega el tipo de evento y ubicación solo si sus IDs existen
            if (typeEventId) {
                formData.append('type_of_event_id', typeEventId);
                console.log('[Main Event] Event type ID added to FormData:', typeEventId);
            }

            if (locationId) {
                formData.append('location_id', locationId);
                console.log('[Main Event] Location ID added to FormData:', locationId);
            }

            if (eventData.image && typeof eventData.image === 'object') {
                formData.append('image', eventData.image);
                console.log('[Main Event] Image attached:', eventData.image.name);
            } else if (eventData.image && typeof eventData.image === 'string' && eventData.image.startsWith('data:')) {
                // Convierte base64 a Blob y luego a File si es necesario
                const base64Response = await fetch(eventData.image);
                const blob = await base64Response.blob();
                const file = new File([blob], "image.png", { type: blob.type });
                formData.append('image', file);
                console.log('[Main Event] Image attached (converted from base64):', file.name);
            }

            console.log('[Main Event] FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, key === 'image' ? `File(${value.name})` : value);
            }

            // Realizamos la solicitud con axios
            const response = await axios.post(`${API_URL}/events`, formData, { credentials: 'include' });

            console.log('Event creation response:', response.data);

            // Verificamos que el código de respuesta sea 200 o 201
            if (response.status !== 200 && response.status !== 201) {
                console.error('Event creation failed:', response.data.message);
                throw new Error(response.data.message || 'Error al crear el evento');
            }

            return response.data;
        } catch (error) {
            console.error('Error creating main event:', error);
            alert(error.message || 'Error al crear el evento principal');
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    // Función completa para crear el evento
    const createCompleteEvent = async (eventData, typeEventData, locationData) => {
        console.group('[Complete Event Flow] Creating event...');
        try {
            setIsCreating(true);

            console.log('Starting complete event creation...');
            console.log('Initial event data:', eventData);
            console.log('Location data:', locationData);
            console.log('Event type data:', typeEventData);

            // Crear el tipo de evento
            const typeEventId = typeEventData ? await createTypeEvent(typeEventData) : null;
            console.log('Type event ID obtained:', typeEventId);

            // Crear la ubicación
            const locationId = await createLocation(locationData);
            console.log('Location ID obtained:', locationId);

            // Crear el evento
            const event = await createMainEvent(eventData, typeEventId, locationId);

            console.log('Event successfully created:', event);
            return event;
        } catch (error) {
            console.error('Complete event creation failed:', error);
            throw error;
        } finally {
            setIsCreating(false);
            console.groupEnd();
        }
    };

    return {
        isCreating,
        createTypeEvent,
        createLocation,
        createMainEvent,
        createCompleteEvent,
        fetchApi
    };
};
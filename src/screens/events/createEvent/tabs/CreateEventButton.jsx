import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useEventAPI } from '../../../../hooks/useEventAPI';

const CreateEventButton = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCompleteEvent } = useEventAPI();

  const handleCreateEvent = async () => {
    setIsSubmitting(true);
    try {
      const eventData = JSON.parse(sessionStorage.getItem('eventData'));
      const rawTypeEventData = JSON.parse(sessionStorage.getItem('tab_tipoEvento_data'));
      const rawLocationData = JSON.parse(sessionStorage.getItem('tab_ubicacion_data'));

      // Validación básica: Verificar si hay datos en la sessionStorage
      if (!eventData || !rawTypeEventData || !rawLocationData) {
        toast.error("Faltan datos para crear el evento. Por favor completa todas las secciones.");
        return;
      }

      const typeEventData = {
        event_type: rawTypeEventData.tipo_eventType,
        description: rawTypeEventData.tipo_description,
        max_Participants: rawTypeEventData.tipo_maxParticipants,
        video_Conference_Link: rawTypeEventData.tipo_videoLink,
        price: rawTypeEventData.tipo_price,
        start_time: rawTypeEventData.tipo_startTime,
        end_time: rawTypeEventData.tipo_endTime,
        mode: rawTypeEventData.tipo_mode
      };

      const locationData = {
        name: rawLocationData.ubicacion_name,
        description: rawLocationData.ubicacion_description,
        price: rawLocationData.ubicacion_price,
        address: rawLocationData.ubicacion_address
      };

      // Llamada para crear el evento
      const event = await createCompleteEvent(eventData, typeEventData, locationData);

      // Limpiar los datos de sessionStorage
      ['eventData', 'tab_tipoEvento_data', 'tab_ubicacion_data'].forEach(key => {
        sessionStorage.removeItem(key);
      });

      toast.success('Evento creado exitosamente!');
      navigate(`/dashboard/events/${event.id}`);
    } catch (error) {
      toast.error('Ocurrió un error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button 
      onClick={handleCreateEvent} 
      className="btn btn-primary" 
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Creando evento...' : 'Crear Evento'}
    </button>
  );
};

export default CreateEventButton;
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LocationForm from './LocationForm';
import NavigationButtons from './NavigationButtons';
import { useEventAPI } from '../../../../hooks/useEventAPI';
import useTabNavigation from '../../../../hooks/useTabNavigation';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../../components/events/ConfirmationModal';

const LocationEvent = () => {
  const navigate = useNavigate();
  const { goToNextSection, goToPreviousSection, isLastSection } = useTabNavigation("ubicacion");

  const [localData, setLocalData] = useState(() => {
    const savedData = JSON.parse(sessionStorage.getItem('tab_ubicacion_data')) || {};
    return {
      ubicacion_name: savedData.ubicacion_name || "",
      ubicacion_description: savedData.ubicacion_description || "",
      ubicacion_price: savedData.ubicacion_price || null,
      ubicacion_address: savedData.ubicacion_address || ""
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);  
  const [errors, setErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const { createCompleteEvent } = useEventAPI();

  // Guardar los datos en sessionStorage cada vez que el formulario cambie
  useEffect(() => {
    sessionStorage.setItem('tab_ubicacion_data', JSON.stringify(localData));
  }, [localData]);

  const validateForm = () => {
    const newErrors = {};
    if (!localData.ubicacion_name.trim()) newErrors.name = "El nombre del lugar es obligatorio";
    if (!localData.ubicacion_address.trim()) newErrors.address = "La dirección es obligatoria";
    if (!localData.ubicacion_description.trim()) newErrors.description = "La descripción es obligatoria";
    if (localData.ubicacion_price === null || isNaN(localData.ubicacion_price)) {
      newErrors.price = "El precio es obligatorio";
    }
    return newErrors;
  };

  // Controladores de cambios
  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    setLocalData(prev => ({
      ...prev, 
      [field]: value === "" ? null : Number(value)
    }));
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsCreating(false);
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }
  
    const confirmed = await ConfirmationModal.show({
      title: 'Creacion de Evento',
      text: '¿Estás seguro de que deseas crear este evento?',
      confirmButtonText: 'Sí, crear evento',
      icon: 'question',
      disabled: false
    });
  
    if (confirmed) {
      try {
        const eventData = JSON.parse(sessionStorage.getItem('eventData'));
        const rawTypeEventData = JSON.parse(sessionStorage.getItem('tab_tipoEvento_data'));
        const rawLocationData = JSON.parse(sessionStorage.getItem('tab_ubicacion_data'));
  
        // Función para combinar fecha y hora correctamente
        const combineDateTime = (dateStr, timeStr) => {
          if (!dateStr || !timeStr) return null;
          return `${dateStr} ${timeStr}:00`;
        };
  
        // Transformar correctamente los datos de ubicación
        const locationData = {
          name: rawLocationData.ubicacion_name,
          description: rawLocationData.ubicacion_description,
          price: rawLocationData.ubicacion_price,
          address: rawLocationData.ubicacion_address
        };
  
        // Transformar CORRECTAMENTE los datos de tipo de evento
        const typeEventData = {
          id_type_of_event: null,
          event_type: rawTypeEventData.tipo_mode,
          description: rawTypeEventData.tipo_description,
          max_Participants: rawTypeEventData.tipo_maxParticipants,
          video_Conference_Link: rawTypeEventData.tipo_videoLink || "",
          price: rawTypeEventData.tipo_price,
          start_time: combineDateTime(rawTypeEventData.tipo_startDate, rawTypeEventData.tipo_startTime),
          end_time: combineDateTime(rawTypeEventData.tipo_endDate, rawTypeEventData.tipo_endTime),
          category_id: rawTypeEventData.tipo_eventType
        };
  
        console.log('Datos del Tipo de Evento:', typeEventData);
        console.log('Datos de Ubicación:', locationData);
  
        // Validar fechas antes de enviar
        if (!typeEventData.start_time || !typeEventData.end_time) {
          throw new Error("Las fechas del evento no son válidas");
        }
  
        await createCompleteEvent(eventData, typeEventData, locationData);
        toast.success('Evento creado exitosamente!');
        
      } catch (error) {
        console.error('Error al crear el evento:', error);
        toast.error(error.message || 'Ocurrió un error al crear el evento');
      } finally {
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (isLastSection) {
      await handleSubmit(); // Si es la última sección, enviamos el formulario
    } else {
      goToNextSection(); // Si no es la última sección, solo avanzamos
    }
  };

  const handleBack = () => {
    goToPreviousSection(); // Navegar hacia atrás
  };

  useEffect(() => {
    const errors = validateForm();
    setIsFormValid(Object.keys(errors).length === 0);
  }, [localData]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Ubicación del Evento</h2>

      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <LocationForm 
          data={localData}
          errors={errors}
          onChange={handleChange}
          onNumberChange={handleNumberChange}
        />
      </div>

      <NavigationButtons
        isLastSection={isLastSection}
        isSubmitting={isSubmitting}
        isCreatingEvent={isCreating}
        isEditingEvent={false}  // Pasamos `false` para indicar que estamos creando el evento
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFormValid={isFormValid} // Pasar la validación al botón de creación
      />
    </div>
  );
};

export default LocationEvent;
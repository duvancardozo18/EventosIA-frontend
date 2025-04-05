import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import useTabNavigation from '../../../../hooks/useTabNavigation';
import NavigationButtons from './NavigationButtons';
import TypeEventForm from "./TypeEventForm"

const TypeEvent = () => {
    // 1. Configuración de navegación y contexto
    const { 
        showNextButton, 
        goToNextSection, 
        goToPreviousSection 
    } = useTabNavigation("tipoEvento");
    
    const { updateFormData } = useOutletContext();

    // 2. Claves únicas para persistencia
    const STORAGE_KEY = 'tab_tipoEvento_data';
    const COMPLETION_KEY = 'tab_tipoEvento_completed';

    // 3. Estado local con prefijos específicos
    const [localData, setLocalData] = useState(() => {
        const savedData = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
        return {
            tipo_eventType: savedData.tipo_eventType || "",
            tipo_description: savedData.tipo_description || "",
            tipo_maxParticipants: savedData.tipo_maxParticipants || null,
            tipo_videoLink: savedData.tipo_videoLink || "",
            tipo_price: savedData.tipo_price || null,
            tipo_startTime: savedData.tipo_startTime || "",
            tipo_endTime: savedData.tipo_endTime || "",
            tipo_mode: savedData.tipo_mode || ""
        };
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    // 5. Efectos secundarios
    useEffect(() => {
        // Persistencia automática de datos
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
        
        // Actualización del contexto principal
        updateFormData('typeEventData', transformDataForContext(localData));
    }, [localData]);

    // 6. Funciones de manejo de cambios
    const handleChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (field, value) => {
        setLocalData(prev => ({
            ...prev, 
            [field]: value === "" ? null : Number(value)
        }));
    };

    // 7. Transformación de datos para el contexto/backend
    const transformDataForContext = (data) => ({
        id_type_of_event: null,
        event_type: data.tipo_mode,
        description: data.tipo_description,
        start_time: data.tipo_startTime,
        end_time: data.tipo_endTime,
        max_Participants: data.tipo_maxParticipants,
        video_Conference_Link: data.tipo_videoLink,
        price: data.tipo_price,
        category_id: data.tipo_eventType
    });

    // 8. Validación del formulario
    const validateForm = () => {
        const newErrors = {};
        
        // Validación de campos básicos
        if (!localData.tipo_eventType.trim()) newErrors.event_type = "El tipo de evento es obligatorio";
        if (!localData.tipo_mode) newErrors.mode = "La modalidad es obligatoria";
        if (!localData.tipo_description.trim()) newErrors.description = "La descripción es obligatoria";
        if (!localData.tipo_startTime) newErrors.start_time = "La hora de inicio es requerida";
        if (!localData.tipo_endTime) newErrors.end_time = "La hora de finalización es requerida";
        
        // Validación de videoconferencia para modalidades virtual/híbrido
        if (["virtual", "hibrido"].includes(localData.tipo_mode)) {
            if (!localData.tipo_videoLink?.trim()) {
                newErrors.video_Conference_Link = "El enlace de videoconferencia es obligatorio";
            } else if (!/^https?:\/\//i.test(localData.tipo_videoLink)) {
                newErrors.video_Conference_Link = "El enlace debe comenzar con http:// o https://";
            }
        }
        
        // Validación de fechas
        if (localData.tipo_startTime && localData.tipo_endTime && 
            new Date(localData.tipo_startTime) >= new Date(localData.tipo_endTime)) {
            newErrors.end_time = "Debe ser posterior a la hora de inicio";
        }
        
        // Validación de precio
        if (localData.tipo_price === null || isNaN(localData.tipo_price)) {
            newErrors.price = "El precio es obligatorio";
        } else if (localData.tipo_price < 0) {
            newErrors.price = "El precio no puede ser negativo";
        } else if (localData.tipo_price > 9999999) {
            newErrors.price = "El precio no puede exceder $10,000";
        }
        
        // Validación de máximo de participantes
        if (localData.tipo_maxParticipants === null || isNaN(localData.tipo_maxParticipants)) {
            newErrors.max_Participants = "El máximo de participantes es obligatorio";
        } else if (localData.tipo_maxParticipants < 1) {
            newErrors.max_Participants = "Debe haber al menos 1 participante";
        } else if (localData.tipo_maxParticipants > 1000) {
            newErrors.max_Participants = "El máximo de participantes no puede exceder 1000";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 9. Manejo del envío del formulario
    const handleNext = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Transformar los datos antes de guardar/mandar al backend
                const dataToSend = transformDataForContext(localData);
                console.log('Datos a enviar al backend:', dataToSend);
                
                // Marcar como completado
                sessionStorage.setItem(COMPLETION_KEY, 'true');
                
                // Navegar al siguiente tab
                goToNextSection();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // 10. Renderizado del componente
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4">Tipo de Evento</h2>

            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
                <TypeEventForm 
                    localData={localData}
                    errors={errors}
                    handleChange={handleChange}
                    handleNumberChange={handleNumberChange}
                />
            </div>
            
            <NavigationButtons
                isLastSection={false}
                isSubmitting={isSubmitting}
                isCreatingEvent={false}
                onBack={goToPreviousSection}
                onNext={handleNext}
            />
        </div>
    );
};

export default TypeEvent;
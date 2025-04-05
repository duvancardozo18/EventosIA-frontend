import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from "react-router-dom";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import useTabNavigation from '../../../../hooks/useTabNavigation';
import ParticipantsTable from '../ParticipantsTable';

const ParticipantsEvent = () => {
    const { 
        showNextButton, 
        goToNextSection, 
        goToPreviousSection 
    } = useTabNavigation("participantes");
    
    // Emulamos el userEmail del administrador
    const adminEmail = "admin@example.com"; // Email fijo para emular al admin
    
    const { updateFormData, eventId } = useOutletContext();

    const STORAGE_KEY = 'tab_participantes_data';
    const COMPLETION_KEY = 'tab_participantes_completed';

    // Estado inicial más robusto
    const [localData, setLocalData] = useState(() => {
        try {
            const savedData = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
            return {
                participants: Array.isArray(savedData?.participants) ? savedData.participants : [],
                newParticipantEmail: savedData?.newParticipantEmail || ""
            };
        } catch (error) {
            console.error("Error loading saved data:", error);
            return {
                participants: [],
                newParticipantEmail: ""
            };
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

      // 1. Mueve transformDataForContext fuera del componente o usa useCallback
      const transformDataForContext = useCallback((data) => {
        try {
            const participants = Array.isArray(data?.participants) ? data.participants : [];
            return {
                participants: participants.map(p => ({
                    // ... mapeo de datos
                })).filter(p => p.participant_email)
            };
        } catch (error) {
            console.error("Error transforming data:", error);
            return { participants: [] };
        }
    }, [eventId]); // Dependencias necesarias

    // 2. Corrige el useEffect problemático
    useEffect(() => {
        try {
            const dataToStore = {
                participants: Array.isArray(localData.participants) ? localData.participants : [],
                newParticipantEmail: localData.newParticipantEmail || ""
            };
            
            // Solo actualiza sessionStorage si los datos cambiaron
            const currentStoredData = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
            if (JSON.stringify(currentStoredData) !== JSON.stringify(dataToStore)) {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
            }

            // Solo actualiza el contexto si los datos cambiaron
            const dataToUpdate = transformDataForContext(localData);
            const currentContextData = updateFormData?.('participantsData');
            if (JSON.stringify(currentContextData) !== JSON.stringify(dataToUpdate)) {
                updateFormData?.('participantsData', dataToUpdate);
            }
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, [localData, transformDataForContext]);

    // handleAddParticipant con validaciones
    const handleAddParticipant = (e) => {
        e.preventDefault();
        
        const email = localData.newParticipantEmail?.trim();
        if (!email) {
            setErrors({ participant_email: "El correo es obligatorio" });
            return;
        }

        if (!email.includes('@')) {
            setErrors({ participant_email: "Ingrese un correo electrónico válido" });
            return;
        }

        if (!eventId) {
            setErrors({ general: "No se pudo identificar el evento" });
            return;
        }

        setLocalData(prev => {
            const currentParticipants = Array.isArray(prev.participants) ? prev.participants : [];
            return {
                ...prev,
                participants: [
                    ...currentParticipants,
                    {
                        participant_email: email,
                        participant_status_id: 1, // Planeado por defecto
                        event_id: eventId,
                        user_email: adminEmail // Usamos el email emulado del admin
                    }
                ],
                newParticipantEmail: ""
            };
        });
        
        setErrors({});
    };

    // handleRemoveParticipant más seguro
    const handleRemoveParticipant = (index) => {
        setLocalData(prev => {
            const currentParticipants = Array.isArray(prev.participants) ? prev.participants : [];
            return {
                ...prev,
                participants: currentParticipants.filter((_, i) => i !== index)
            };
        });
    };

    // validateForm más seguro
    const validateForm = () => {
        const newErrors = {};
        if (!Array.isArray(localData.participants) || localData.participants.length === 0) {
            newErrors.general = "Debe agregar al menos un participante";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handleNext más seguro
    const handleNext = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                sessionStorage.setItem(COMPLETION_KEY, 'true');
                if (goToNextSection) {
                    goToNextSection();
                }
            } catch (error) {
                console.error("Error in handleNext:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-6">Participantes del Evento</h2>
                
                <div className="w-full p-6 mb-6">
                    <form onSubmit={handleAddParticipant} className="flex gap-4 mb-6">
                        <div className="flex-grow">
                            <label htmlFor="participant_email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo del participante *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    id="participant_email"
                                    value={localData.newParticipantEmail || ''}
                                    onChange={(e) => setLocalData(prev => ({
                                        ...prev,
                                        newParticipantEmail: e.target.value
                                    }))}
                                    placeholder="ejemplo@correo.com"
                                    className={`flex-grow rounded-md border ${errors.participant_email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                            {errors.participant_email && (
                                <p className="mt-1 text-sm text-red-600">{errors.participant_email}</p>
                            )}
                        </div>
                    </form>

                    <ParticipantsTable 
                        participants={Array.isArray(localData.participants) ? localData.participants : []} 
                        onRemoveParticipant={handleRemoveParticipant}
                    />
                </div>

                {errors.general && (
                    <div className="w-full max-w-4xl mb-4">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                    </div>
                )}

                <div className="w-full max-w-4xl flex justify-between">
                    <button
                        onClick={goToPreviousSection}
                        className="px-6 py-2.5 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors font-medium"
                    >
                        <HiArrowLeft className="size-5" />
                        <span>Retroceder</span>
                    </button>

                    {showNextButton && (
                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
                        >
                            {isSubmitting ? 'Guardando...' : 'Siguiente'}
                            <HiArrowRight className="size-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantsEvent;
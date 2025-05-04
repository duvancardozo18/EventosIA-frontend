import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import useTabNavigation from '../../../../hooks/useTabNavigation';
import { AuthContext } from '../../../../config/AuthProvider';
import EventForm from './EventForm'; // Import the new component

const Event = () => {
    const { showNextButton, goToNextSection } = useTabNavigation("evento");
    const navigate = useNavigate();
    
    // Get current user ID from AuthContext
    const { userId, loading, isAuthenticated } = useContext(AuthContext);

    // Recuperar datos previos desde sessionStorage
    const storedData = JSON.parse(sessionStorage.getItem("eventData")) || {};

    // Estado inicial del formulario
    const [localData, setLocalData] = useState({
        name: storedData.name || "",
        event_state_id: 1,
        type_of_event_id: storedData.type_of_event_id || null,
        location_id: storedData.location_id || null,
        user_created_by: storedData.user_created_by || null,
        image: storedData.image || null
    });

    // Estado para tracking de validación
    const [isFormValid, setIsFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    // Update user_created_by when userId is available
    useEffect(() => {
        if (userId) {
            setLocalData(prev => {
                const updatedData = { 
                    ...prev, 
                    user_created_by: userId 
                };
                sessionStorage.setItem("eventData", JSON.stringify(updatedData));
                return updatedData;
            });
        }
    }, [userId]);

    // Efecto para cargar la imagen al montar el componente
    useEffect(() => {
        if (storedData.image) {
            setLocalData(prev => ({
                ...prev,
                image: storedData.image
            }));
        }
    }, []);

    // Manejo de cambios en los campos
    const handleChange = (field, value) => {
        setLocalData(prev => {
            const updatedData = { ...prev, [field]: value };
            sessionStorage.setItem("eventData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    // Manejo de validación del formulario
    const handleValidationChange = (isValid, errors) => {
        setIsFormValid(isValid);
        setFormErrors(errors);
    };

    // Manejo de la imagen
    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            setLocalData(prev => {
                const updatedData = { 
                    ...prev, 
                    image: base64Image
                };
                sessionStorage.setItem("eventData", JSON.stringify(updatedData));
                return updatedData;
            });
        };
        reader.readAsDataURL(file);
    };

    // Función para eliminar la imagen actual
    const handleRemoveImage = () => {
        setLocalData(prev => {
            const updatedData = { 
                ...prev, 
                image: null
            };
            sessionStorage.setItem("eventData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    // Manejo del botón de siguiente
    const handleNext = (e) => {
        e.preventDefault();
        if (isFormValid) {
            goToNextSection();
        }
    };

    // Función para limpiar todos los datos del formulario
    const clearFormData = () => {
        const formKeysToRemove = [
            'eventData',
            'tab_ubicacion_data',
            'tab_tipoEvento_data',
            'tab_evento_data'
        ];
        
        formKeysToRemove.forEach(key => {
            sessionStorage.removeItem(key);
        });
        
        setLocalData({
            name: "",
            event_state_id: 1,
            type_of_event_id: null,
            location_id: null,
            user_created_by: userId,
            image: null
        });
    };

    // Función para manejar la cancelación
    const handleCancel = () => {
        navigate("../../events");
        clearFormData();
    };

    // Show loading indicator while auth is loading
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-gray-600 animate-pulse">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex justify-between mb-4">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors font-medium"
                >
                    Cancelar
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Detalles del Evento</h2>

            {/* Form component with validation handling */}
            <EventForm 
                formData={localData}
                userId={userId}
                onChange={handleChange}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                onValidationChange={handleValidationChange}
            />

            <div className="w-full max-w-4xl flex justify-end mt-6">
                {showNextButton && (
                    <button
                        onClick={handleNext}
                        disabled={!isFormValid}
                        className={`px-6 py-2.5 ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'} text-white rounded-lg flex items-center gap-2 transition-colors font-medium`}
                    >
                        Siguiente
                        <HiArrowRight className="size-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Event;
import { useState, useEffect, useContext } from 'react';
import { HiArrowRight } from "react-icons/hi";
import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';
import Dropzone from '../../../../components/events/Dropzone';
import useTabNavigation from '../../../../hooks/useTabNavigation';
import { AuthContext } from '../../../../config/AuthProvider';

const Event = () => {
    const { showNextButton, goToNextSection } = useTabNavigation("evento");
    const { userId } = useContext(AuthContext);

    // Recuperar datos previos desde sessionStorage
    const storedData = JSON.parse(sessionStorage.getItem("eventData")) || {};

    // Estado inicial del formulario
    const [localData, setLocalData] = useState({
        name: storedData.name || "",
        event_state_id: 1,
        type_of_event_id: storedData.type_of_event_id || null,
        location_id: storedData.location_id || null,
        user_created_by: userId || null,
        image: null, // Siempre null al inicio, se llenará con el File real
        imagePreview: storedData.imagePreview || "" // Solo la vista previa
    });

    // Actualiza user_created_by cuando cambia userId
    useEffect(() => {
        if (userId) {
            setLocalData(prev => ({
                ...prev,
                user_created_by: userId
            }));
        }
    }, [userId]);

    // Manejo de cambios en los campos
    const handleChange = (field, value) => {
        setLocalData(prev => {
            const updatedData = { ...prev, [field]: value };
            // Guardamos en sessionStorage sin el File (solo la preview)
            const dataToStore = {
                ...updatedData,
                image: null
            };
            sessionStorage.setItem("eventData", JSON.stringify(dataToStore));
            return updatedData;
        });
    };

    // Manejo de la imagen
    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const preview = reader.result;
            setLocalData(prev => ({
                ...prev,
                image: file, // Guardamos el File real en el estado
                imagePreview: preview // Y la vista previa
            }));
            
            // Guardamos solo la preview en sessionStorage
            const dataToStore = {
                ...localData,
                imagePreview: preview,
                image: null // No guardamos el File
            };
            sessionStorage.setItem("eventData", JSON.stringify(dataToStore));
        };
        reader.readAsDataURL(file);
    };

    // Manejo del botón de siguiente
    const handleNext = (e) => {
        e.preventDefault();
        goToNextSection();
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Evento</h2>

            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex flex-col items-center">
                        <Label htmlFor="name">Nombre del Evento</Label>
                        <div className="w-full max-w-md">
                            <Input 
                                type="text" 
                                id="name" 
                                value={localData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="image">Imagen del Evento</Label>
                        <Dropzone 
                            onFileSelect={handleImageUpload} 
                            imagePreview={localData.imagePreview}
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl flex justify-end mt-6">
                {showNextButton && (
                    <button
                        onClick={handleNext}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"
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
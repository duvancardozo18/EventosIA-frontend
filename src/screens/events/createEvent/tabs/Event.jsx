import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';
import Dropzone from '../../../../components/events/Dropzone';
import useTabNavigation from '../../../../hooks/useTabNavigation';

const Event = () => {
    const { showNextButton, goToNextSection } = useTabNavigation("evento");

    // Recuperar datos previos desde sessionStorage
    const storedData = JSON.parse(sessionStorage.getItem("eventData")) || {};

    // Estado inicial del formulario para la sección de evento
    const [localData, setLocalData] = useState({
        name: storedData.name || "",
        event_state_id: 1, //por defecto es 1 siempre
        type_of_event_id: storedData.type_of_event_id || null,
        location_id: storedData.location_id || null,
        user_created_by: 3,
        image: null
    });

    const [imagePreview, setImagePreview] = useState(storedData.imagePreview || "");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (storedData.image) {
            fetch(storedData.image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "image.jpg", { type: blob.type });
                    setLocalData(prev => ({ ...prev, image: file }));
                });
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

    // Manejo de la imagen
    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setLocalData(prev => {
                const updatedData = { ...prev, image: file };
                // Guarda la previsualización pero NO el archivo
                sessionStorage.setItem("eventData", JSON.stringify({ 
                    ...updatedData, 
                    image: null, // No intentes guardar el archivo
                    imagePreview: reader.result // Solo guarda la previsualización
                }));
                return updatedData;
            });
        };
        reader.readAsDataURL(file);
    };

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {};
        if (!localData.name.trim()) newErrors.name = "El nombre del evento es obligatorio";
        if (!localData.image) newErrors.image = "Debes subir una imagen del evento";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejo del botón de siguiente
    const handleNext = (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            goToNextSection(); // Solo avanza al siguiente tab
        }
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
                                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="image">Imagen del Evento</Label>
                        <Dropzone 
                            onFileSelect={handleImageUpload} 
                            imagePreview={imagePreview}
                            accept="image/*"
                            className={errors.image ? 'border-red-500' : ''}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                        )}
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

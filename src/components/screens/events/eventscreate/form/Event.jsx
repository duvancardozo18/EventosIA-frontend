import { useState, useRef } from 'react';
import { useOutletContext } from "react-router-dom"; // Para validación y navegación
import { HiUpload, HiArrowRight, HiArrowLeft } from "react-icons/hi";
import Label from "../../LabelForm";
import Input from "../../InputForm";
import useTabNavigation from '../../../../../hooks/UseTabNavigation';


const Event = () => {
    const { updateFormData, formData } = useOutletContext();

    // Estados para los campos del formulario
    const [name, setName] = useState(formData.evento?.name || "");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState("");

    const fileInputRef = useRef(null);

    // Usar el custom hook para manejar la navegación
    const { goToNextSection, goToPreviousSection, showPreviousButton, showNextButton } = useTabNavigation("evento");

    // Validar formulario antes de continuar
    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = "El nombre del evento es obligatorio.";
        if (!image) newErrors.image = "Debes subir una imagen del evento.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejo de cambio en los inputs
    const handleChange = (field, value) => {
        if (field === "name") setName(value);

        updateFormData("evento", { [field]: value });
    };

    // Función para manejar el botón "Siguiente"
    const handleNext = () => {
        if (validateForm()) {
            updateFormData("evento", { 
                name, 
                event_state_id: 1, // Aquí se incluye el estado predeterminado
                imageFile
            });
            goToNextSection(); // Navegar a la siguiente sección
        }
    };

    // Función para manejar el botón "Retroceder"
    const handlePrevious = () => {
        goToPreviousSection(); // Navegar a la sección anterior
    };

    // Manejador para la subida de imágenes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImage(file.name);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para activar el input de archivo
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del Evento */}
                    <div>
                        <Label htmlFor="name">Nombre del Evento</Label>
                        <Input 
                            type="text" 
                            id="name" 
                            value={name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Subir Imagen */}
                    <div className="md:col-span-2">
                        <Label htmlFor="image">Imagen del Evento</Label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                id="image"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"
                            >
                                <HiUpload className="size-5" />
                                <span>Subir Imagen</span>
                            </button>
                            {image && (
                                <span className="text-sm text-gray-600">{image}</span>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="mt-4 relative">
                                <img
                                    src={imagePreview}
                                    alt="Vista previa de la imagen"
                                    className="max-w-full h-48 w-48 object-cover rounded-lg" // Tamaño estándar
                                />
                                {/* Botón para eliminar la imagen */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(""); // Limpiar el nombre de la imagen
                                        setImageFile(null); // Limpiar el archivo
                                        setImagePreview(""); // Limpiar la vista previa
                                        fileInputRef.current.value = ""; // Limpiar el input de archivo
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>

                    {/* Botones de navegación */}
                    <div className="mt-8 flex justify-between">
                        {/* Botón de Retroceder */}
                        {showPreviousButton && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors font-medium"
                            >
                                <HiArrowLeft className="size-5" />
                                <span>Retroceder</span>
                            </button>
                        )}

                        {/* Botón de Siguiente */}
                        {showNextButton && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"
                            >
                                <span>Siguiente</span>
                                <HiArrowRight className="size-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Event;
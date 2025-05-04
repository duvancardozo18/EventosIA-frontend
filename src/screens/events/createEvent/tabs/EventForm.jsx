import { useState, useEffect } from 'react';
import { HiX } from "react-icons/hi";
import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';
import Dropzone from '../../../../components/events/Dropzone';

const EventForm = ({ formData, onChange, onImageUpload, onRemoveImage, userId, onValidationChange }) => {
  // Estado local para errores
  const [errors, setErrors] = useState({});

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre del evento es obligatorio";
    if (!formData.image) newErrors.image = "Debes subir una imagen del evento";
    if (!formData.user_created_by) newErrors.user = "No se ha identificado el usuario creador";
    return newErrors;
  };

  // Efecto para validar cada vez que los datos cambian
  useEffect(() => {
    const currentErrors = validateForm();
    setErrors(currentErrors);
    
    // Notificar al componente padre sobre el estado de validación
    if (onValidationChange) {
      onValidationChange(Object.keys(currentErrors).length === 0, currentErrors);
    }
  }, [formData, userId]);

  // Manejador de cambio con validación
  const handleChange = (field, value) => {
    onChange(field, value);
    
    // Validación en tiempo real (opcional)
    const updatedData = { ...formData, [field]: value };
    const fieldErrors = validateForm(updatedData);
    setErrors(fieldErrors);
  };
  
  return (
    <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex flex-col items-center">
          <Label htmlFor="name">Nombre del Evento</Label>
          <div className="w-full max-w-md">
            <Input 
              type="text" 
              id="name" 
              value={formData.name}
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
          <div className="relative">
            <Dropzone 
              onFileSelect={onImageUpload} 
              imagePreview={formData.image}
              accept="image/*"
              className={errors.image ? 'border-red-500' : ''}
            />
            {/* Botón para eliminar imagen (solo visible cuando hay imagen) */}
            {formData.image && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Eliminar imagen"
              >
                <HiX className="size-4" />
              </button>
            )}
          </div>
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
        </div>
        
        {errors.user && (
          <div className="md:col-span-2">
            <p className="text-red-500 text-sm text-center">{errors.user}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventForm;
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { HiArrowRight, HiX } from "react-icons/hi";
import Label from "../../../../components/events/LabelForm";
import Input from "../../../../components/events/InputForm";
import Dropzone from "../../../../components/events/Dropzone";
import useEditTabNavigation from "../../../../hooks/useEditTabNavigation";

const Event = () => {
  console.log("========== RENDERIZANDO COMPONENTE EVENT ==========");
  
  const {
    formData,
    updateFormData,
    markSectionCompleted,
    goToNextSection,
    currentSection
  } = useOutletContext();
  
  console.log("Context recibido en Event:", {
    formDataExists: !!formData,
    currentSection,
    eventoData: formData?.evento
  });
  
  const { showNextButton } = useEditTabNavigation("editarEvento");
  console.log("showNextButton:", showNextButton);

  // Verificar datos iniciales
  const initialData = formData?.evento || {};
  console.log("Datos iniciales para el formulario:", initialData);
  console.log("- event_name:", initialData.event_name);
  console.log("- id_event_state:", initialData.id_event_state);
  console.log("- state:", initialData.state);
  console.log("- imagePreview:", initialData.imagePreview);

  // Estado local sincronizado con los nombres de campos en el componente principal
  const [localData, setLocalData] = useState(() => {
    console.log("Inicializando estado local con valores iniciales");
    return {
      event_name: initialData.event_name || "",
      id_event_state: initialData.id_event_state || 1,
      state: initialData.state || "",
      image: null, // Solo si el usuario sube una nueva imagen
      imagePreview: initialData.imagePreview || "", // URL desde image_url[0]
      imageFileName: initialData.imageFileName || ""
    };
  });
  
  console.log("Estado local inicializado:", localData);

  // Efecto para mantener la sincronización con formData si cambia externamente
  useEffect(() => {
    if (formData?.evento) {
      console.log("formData.evento cambió, actualizando estado local");
      console.log("Nuevos datos de formData.evento:", formData.evento);
      
      setLocalData(prev => {
        const updated = {
          event_name: formData.evento.event_name || prev.event_name,
          id_event_state: formData.evento.id_event_state || prev.id_event_state,
          state: formData.evento.state || prev.state,
          // Mantener la imagen local si existe, de lo contrario usar la del servidor
          image: prev.image, 
          imagePreview: prev.image ? prev.imagePreview : formData.evento.imagePreview || prev.imagePreview,
          imageFileName: prev.imageFileName
        };
        
        console.log("Estado local actualizado:", updated);
        return updated;
      });
    } else {
      console.log("formData.evento no existe o es null/undefined");
    }
  }, [formData]);

  // Manejo de cambios en campos de texto
  const handleChange = (field, value) => {
    console.log(`Cambiando campo ${field} a:`, value);
    
    setLocalData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log(`Estado local después de cambiar ${field}:`, updated);
      return updated;
    });
  };

  // Manejo de la imagen subida - adaptado para trabajar con onFileSelect
  const handleImageUpload = (file) => {
    if (!file) {
      console.log("No se seleccionó ningún archivo");
      return;
    }

    console.log("Archivo seleccionado:", file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      console.log("Imagen convertida a base64");
      
      setLocalData(prev => {
        const updated = {
          ...prev,
          image: file, // el File real
          imagePreview: base64Data,
          imageFileName: file.name
        };
        console.log("Estado local actualizado con nueva imagen:", {
          ...updated,
          image: "File object (no mostrado)",
          imagePreview: "Base64 data (truncado)"
        });
        return updated;
      });
    };

    reader.readAsDataURL(file);
  };

  // Función para eliminar la imagen
  const handleRemoveImage = () => {
    console.log("Eliminando imagen");
    setLocalData(prev => ({
      ...prev,
      image: null,
      imagePreview: "",
      imageFileName: ""
    }));
  };

  // Manejo de navegación a la siguiente pestaña
  const handleNext = (e) => {
    e.preventDefault();
    console.log("Submit del formulario. Datos actuales:", localData);

    // Actualiza los datos en el estado global
    updateFormData("evento", {
      ...formData.evento, // <-- preserva los valores existentes (incluye IDs)
      ...localData        // <-- sobrescribe los que sí estás editando
    });


    // Marca esta sección como completada
    console.log("Marcando sección 'editarEvento' como completada");
    markSectionCompleted("editarEvento");

    // Navega a la siguiente pestaña
    console.log("Navegando a la siguiente sección");
    goToNextSection();
  };

  console.log("Renderizando UI del Event component");

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>
      
      <form onSubmit={handleNext} className="space-y-6">
        {/* Nombre del evento */}
        <div className="mb-4">
          <Label htmlFor="event_name" text="Nombre del Evento" />
          <Input
            id="event_name"
            type="text"
            value={localData.event_name}
            onChange={(e) => handleChange("event_name", e.target.value)}
            placeholder="Ingrese el nombre del evento"
            className="w-full"
            required
          />
          <div className="text-xs text-gray-500">
            Valor actual: {localData.event_name || "No definido"}
          </div>
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <Label htmlFor="image" text="Imagen del Evento" />
          
          {/* Botón para remover la imagen (solo visible cuando hay una imagen) */}
          {localData.imagePreview && (
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                title="Eliminar imagen"
              >
                <HiX className="h-4 w-4 mr-1" />
                Eliminar imagen
              </button>
            </div>
          )}
          
          {/* Dropzone con vista previa integrada */}
          <Dropzone 
            onFileSelect={handleImageUpload} 
            imagePreview={localData.imagePreview}
          />
          
          {/* Nombre del archivo */}
          {localData.imagePreview && (
            <div className="mt-1 text-xs text-gray-500">
              Imagen cargada: {localData.imageFileName || "Imagen del servidor"}
            </div>
          )}
        </div>

        {/* Botón siguiente */}
        <div className="flex justify-end mt-6">
          {showNextButton && (
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Siguiente
              <HiArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Event;
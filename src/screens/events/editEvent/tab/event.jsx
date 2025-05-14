import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { HiArrowRight, HiX } from "react-icons/hi";
import Label from "../../../../components/events/LabelForm";
import Input from "../../../../components/events/InputForm";
import Dropzone from "../../../../components/events/Dropzone";
import useEditTabNavigation from "../../../../hooks/useEditTabNavigation";

const Event = () => {
  const {
    formData,
    updateFormData,
    markSectionCompleted,
    goToNextSection,
    currentSection
  } = useOutletContext();

  const { showNextButton } = useEditTabNavigation("editarEvento");

  const initialData = formData?.evento || {};

  const [localData, setLocalData] = useState(() => ({
    event_name: initialData.event_name || "",
    id_event_state: initialData.id_event_state || 1,
    state: initialData.state || "",
    image: undefined, // ← importante: no null
    imagePreview: initialData.imagePreview || initialData.image_url || "",
    imageFileName: initialData.imageFileName || ""
  }));

  useEffect(() => {
    if (formData?.evento) {
      setLocalData(prev => ({
        event_name: formData.evento.event_name || prev.event_name,
        id_event_state: formData.evento.id_event_state || prev.id_event_state,
        state: formData.evento.state || prev.state,
        image: prev.image, // si se cargó una nueva, se conserva
        imagePreview: prev.image ? prev.imagePreview : formData.evento.imagePreview || formData.evento.image_url || prev.imagePreview,
        imageFileName: prev.imageFileName
      }));
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalData(prev => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
        imageFileName: file.name
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setLocalData(prev => ({
      ...prev,
      image: null,
      imagePreview: "",
      imageFileName: ""
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Clonar evento original sin campo image si no hay nueva imagen
    const updated = {
      ...formData.evento,
      ...localData
    };

    // 🔥 Forzar eliminación del campo image si NO es un File
    if (!(localData.image instanceof File)) {
      delete updated.image;
    }

    updateFormData("evento", updated);
    markSectionCompleted("editarEvento");
    goToNextSection();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>

      <form onSubmit={handleNext} className="space-y-6">
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

        <div className="mb-4">
          <Label htmlFor="image" text="Imagen del Evento" />

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

          <Dropzone
            onFileSelect={handleImageUpload}
            imagePreview={localData.imagePreview}
          />

          {localData.imagePreview && (
            <div className="mt-1 text-xs text-gray-500">
              Imagen cargada: {localData.imageFileName || "Imagen del servidor"}
            </div>
          )}
        </div>

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
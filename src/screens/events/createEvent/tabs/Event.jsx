import { useState, useEffect, useContext } from 'react';
import { HiArrowRight } from "react-icons/hi";
import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';
import Dropzone from '../../../../components/events/Dropzone';
import useTabNavigation from '../../../../hooks/useTabNavigation';
import { AuthContext } from '../../../../config/AuthProvider';

// ✅ Función para convertir base64 a archivo File real (mantenida para referencia)
const dataURLtoFile = (dataurl, filename) => {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const Event = () => {
  const { showNextButton, goToNextSection } = useTabNavigation("evento");
  const { userId } = useContext(AuthContext);

  // Recuperar datos del sessionStorage
  const storedData = JSON.parse(sessionStorage.getItem("eventData")) || {};

  // Estado inicial del formulario
  const [localData, setLocalData] = useState({
    name: storedData.name || "",
    event_state_id: 1,
    type_of_event_id: storedData.type_of_event_id || null,
    location_id: storedData.location_id || null,
    user_created_by: userId || null,
    image: storedData.image || null, // Guardamos la imagen en base64 directamente
    imagePreview: storedData.imagePreview || "",
    imageFileName: storedData.imageFileName || "" // Agregamos nombre del archivo para referencia
  });

  // Actualizar user_created_by si cambia el contexto
  useEffect(() => {
    if (userId) {
      setLocalData(prev => ({
        ...prev,
        user_created_by: userId
      }));
    }
  }, [userId]);

  // Manejo de cambios en campos de texto
  const handleChange = (field, value) => {
    setLocalData(prev => {
      const updatedData = { ...prev, [field]: value };
      sessionStorage.setItem("eventData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // Manejo de la imagen subida
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      
      // Actualizamos localData con la imagen en base64 y preview
      setLocalData(prev => {
        const updatedData = {
          ...prev,
          image: base64Data, // Guardamos directamente el base64
          imagePreview: base64Data,
          imageFileName: file.name // Guardamos el nombre del archivo para referencia
        };
        
        // Guardamos en sessionStorage
        sessionStorage.setItem("eventData", JSON.stringify(updatedData));
        return updatedData;
      });
    };

    reader.readAsDataURL(file);
  };

  const handleNext = (e) => {
    e.preventDefault();
    goToNextSection();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">

        <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del evento a la izquierda */}
            <div className="flex flex-col items-center md:items-start">
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

            {/* Imagen a la derecha */}
            <div className="flex flex-col items-center md:items-start">
              <Label htmlFor="image">Imagen del Evento</Label>
              <Dropzone
                onFileSelect={handleImageUpload}
                imagePreview={localData.imagePreview}
                accept="image/*"
              />
              {localData.image && (
                <p className="text-green-600 mt-2">
                  ✓ Archivo guardado: {localData.imageFileName}
                </p>
              )}
            </div>
          </div>
        </div>


      {/* Botón siguiente */}
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
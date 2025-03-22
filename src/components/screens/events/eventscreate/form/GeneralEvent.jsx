import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom"; // Para validación y navegación
import Label from "../../LabelForm";
import Input from "../../InputForm";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import "react-datepicker/dist/react-datepicker.css";
import useTabNavigation from "../../../../../hooks/UseTabNavigation";

function GeneralEvent() {
  const { updateFormData, formData } = useOutletContext();

  // Estados para los campos del formulario
  const [eventName, setEventName] = useState(formData.evento?.eventName || "");
  const [mode, setMode] = useState(formData.evento?.mode || "");
  const [description, setDescription] = useState(formData.evento?.description || "");
  const [maxParticipants, setMaxParticipants] = useState(formData.evento?.maxParticipants || "");
  const [videoConferenceLink, setVideoConferenceLink] = useState(formData.evento?.videoConferenceLink || "");
  const [price, setPrice] = useState(formData.evento?.price || "");
  const [errors, setErrors] = useState({});
  const [startTime, setStartTime] = useState(formData.evento?.start_time || "");
  const [endTime, setEndTime] = useState(formData.evento?.end_time || "");

  // Usar el custom hook para manejar la navegación
  const { goToNextSection, goToPreviousSection, showPreviousButton, showNextButton } = useTabNavigation("tipoEvento");

  // Opciones para el tipo de evento
  const modeOptions = [
    { value: "virtual", label: "Virtual" },
    { value: "in-person", label: "Presencial" },
    { value: "hybrid", label: "Híbrido" },
  ];

  // Validar formulario antes de continuar
  const validateForm = () => {
    const newErrors = {};

    if (!eventName.trim()) newErrors.eventName = "El nombre del evento es obligatorio.";
    if (!mode) newErrors.mode = "Debes seleccionar un tipo de evento.";
    if (!description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!maxParticipants || maxParticipants <= 0) newErrors.maxParticipants = "El número de participantes debe ser mayor a 0.";
    if (mode === "virtual" || mode === "hybrid") {
      if (!videoConferenceLink.trim()) newErrors.videoConferenceLink = "El enlace de videoconferencia es obligatorio.";
    }
    if (!price || parseFloat(price) < 0) newErrors.price = "El precio debe ser mayor o igual a 0.";
    // Validar fechas
    if (!startTime) newErrors.start_time = "La fecha de inicio es obligatoria.";
    if (!endTime) newErrors.end_time = "La fecha de finalización es obligatoria.";
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.end_time = "La fecha de finalización debe ser posterior a la fecha de inicio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambio en los inputs
  const handleChange = (field, value) => {
    if (field === "eventName") setEventName(value);
    if (field === "mode") setMode(value);
    if (field === "description") setDescription(value);
    if (field === "maxParticipants") setMaxParticipants(value);
    if (field === "videoConferenceLink") setVideoConferenceLink(value);
    if (field === "price") setPrice(value);
    if (field === "start_time") setStartTime(value);
    if (field === "end_time") setEndTime(value);

    updateFormData("evento", { [field]: value });
  };

  // Función para manejar el botón "Siguiente"
  const handleNext = () => {
    if (validateForm()) {
      updateFormData("evento", { 
        eventName, 
        mode, 
        description,
        maxParticipants, 
        videoConferenceLink, 
        price,
        start_time: startTime,
        end_time: endTime,
       });
      goToNextSection(); // Navegar a la siguiente sección usando el hook
    }
  };

  // Función para manejar el botón "Retroceder"
  const handlePrevious = () => {
    goToPreviousSection(); // Navegar a la sección anterior usando el hook
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del Evento */}
          <div>
            <Label htmlFor="eventName">Nombre del Evento</Label>
            <Input 
              type="text" 
              id="eventName" 
              value={eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
              className="w-full" 
            />
            {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>}
          </div>

          {/* Tipo de Evento */}
          <div>
            <Label htmlFor="mode">Modalidad</Label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => handleChange("mode", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Seleccione la modalidad del evento</option>
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode}</p>}
          </div>

          {/* Descripción del Evento */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Descripción del Evento</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-32 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Escribe la descripción del evento aquí..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Máximo de Participantes */}
          <div>
            <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
            <Input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => handleChange("maxParticipants", e.target.value)}
              className="w-full"
              min="1"
            />
            {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
          </div>

          {/* Precio del Evento */}
          <div>
            <Label htmlFor="price">Precio del Evento</Label>
            <Input
              type="text" // Cambiado a tipo "text" para mayor control
              id="price"
              value={price}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Validar que solo sean números y un solo punto decimal
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  handleChange("price", inputValue);
                }
              }}
              className="w-full"
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Enlace de Videoconferencia */}
          {(mode === "virtual" || mode === "hybrid") && (
            <div className="md:col-span-2">
              <Label htmlFor="videoConferenceLink">Enlace de Videoconferencia</Label>
              <Input
                type="url"
                id="videoConferenceLink"
                value={videoConferenceLink}
                onChange={(e) => handleChange("videoConferenceLink", e.target.value)}
                placeholder="https://..."
                className="w-full"
              />
              {errors.videoConferenceLink && <p className="text-red-500 text-xs mt-1">{errors.videoConferenceLink}</p>}
            </div>
          )}

          {/* Fecha y Hora de Inicio */}
          <div>
            <Label htmlFor="start_time">Fecha y Hora de Inicio</Label>
            <Input
              type="datetime-local"
              id="start_time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                handleChange("start_time", e.target.value);
              }}
              className="w-full"
            />
            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
          </div>

          {/* Fecha y Hora de Finalización */}
          <div>
            <Label htmlFor="end_time">Fecha y Hora de Finalización</Label>
            <Input
              type="datetime-local"
              id="end_time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                handleChange("end_time", e.target.value);
              }}
              className="w-full"
            />
            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
          </div>
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
  );
}

export default GeneralEvent;
import { useEffect, useState } from 'react';
import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';
import DateTimeInput from '../../../../components/events/DateTimeInput';
import DateTimePicker from '../../../../components/events/DateTimePicker';

const TypeEventForm = ({ 
  localData, 
  errors, 
  handleChange, 
  handleNumberChange,
  handleDateChange,
  showStartDate,
  setShowStartDate,
  showStartTime,
  setShowStartTime,
  showEndDate,
  setShowEndDate,
  showEndTime,
  setShowEndTime
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // 4. Opciones para la modalidad
  const modeOptions = [
    { value: "virtual", label: "Virtual" },
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorCategories(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tipo de Evento */}
      <div>
        <Label htmlFor="tipo_eventType">Tipo de Evento *</Label>
        {loadingCategories ? (
          <div className="w-full h-11 rounded-lg border px-4 py-2.5 text-sm bg-gray-100 animate-pulse"></div>
        ) : errorCategories ? (
          <div className="text-red-500 text-sm">Error cargando categorías: {errorCategories}</div>
        ) : (
          <select
            id="tipo_eventType"
            value={localData.tipo_eventType}
            onChange={(e) => handleChange("tipo_eventType", e.target.value)}
            className={`w-full h-11 rounded-lg border px-4 py-2.5 text-sm ${
              errors.event_type ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Seleccione el tipo de evento</option>
            {categories.map((category) => (
              <option key={category.id_category} value={category.id_category}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>}
      </div>

      {/* Modalidad del Evento */}
      <div>
        <Label htmlFor="tipo_mode">Modalidad *</Label>
        <select
          id="tipo_mode"
          value={localData.tipo_mode}
          onChange={(e) => handleChange("tipo_mode", e.target.value)}
          className={`w-full h-11 rounded-lg border px-4 py-2.5 text-sm ${
            errors.mode ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">Seleccione una modalidad</option>
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode}</p>}
      </div>

      {/* Descripción */}
      <div className="md:col-span-2">
        <Label htmlFor="tipo_description">Descripción *</Label>
        <textarea
          id="tipo_description"
          value={localData.tipo_description}
          onChange={(e) => handleChange("tipo_description", e.target.value)}
          rows={4}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Máximo de Participantes */}
      <div>
        <Label htmlFor="tipo_maxParticipants">Máximo de Participantes *</Label>
        <Input
          type="number"
          id="tipo_maxParticipants"
          value={localData.tipo_maxParticipants || ''}
          onChange={(e) => handleNumberChange("tipo_maxParticipants", e.target.value)}
          min="1"
          className={`w-full ${errors.max_Participants ? 'border-red-500' : ''}`}
        />
        {errors.max_Participants && (
          <p className="text-red-500 text-xs mt-1">{errors.max_Participants}</p>
        )}
      </div>

      {/* Precio */}
      <div>
        <Label htmlFor="tipo_price">Precio ($) *</Label>
        <Input
          type="number"
          id="tipo_price"
          value={localData.tipo_price || ''}
          onChange={(e) => handleNumberChange("tipo_price", e.target.value)}
          min="0"
          step="0.01"
          className={`w-full ${errors.price ? 'border-red-500' : ''}`}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* Enlace de Videoconferencia - Solo para virtual/híbrido */}
      {["virtual", "hibrido"].includes(localData.tipo_mode) && (
        <div className="md:col-span-2">
          <Label htmlFor="tipo_videoLink">Enlace de Videoconferencia *</Label>
          <Input
            type="url"
            id="tipo_videoLink"
            value={localData.tipo_videoLink}
            onChange={(e) => handleChange("tipo_videoLink", e.target.value)}
            placeholder="https://..."
            className={`w-full ${errors.video_Conference_Link ? 'border-red-500' : ''}`}
          />
          {errors.video_Conference_Link && (
            <p className="text-red-500 text-xs mt-1">{errors.video_Conference_Link}</p>
          )}
        </div>
      )}

      {/* Fecha y Hora de Inicio */}
      <div className="relative">
        <DateTimeInput
          dateId="tipo_startDate"
          timeId="tipo_startTime"
          label="Fecha y Hora de Inicio *"
          dateValue={localData.tipo_startDate}
          timeValue={localData.tipo_startTime}
          onDateClick={() => setShowStartDate(true)}
          onTimeClick={() => setShowStartTime(true)}
          dateError={errors.start_date}
          timeError={errors.start_time}
        />
        {showStartDate && (
          <DateTimePicker
            isOpen={showStartDate}
            onClose={() => setShowStartDate(false)}
            onSelect={(value) => handleDateChange(value, "startDate")}
            initialValue={localData.tipo_startDate}
            mode="date"
          />
        )}
        {showStartTime && (
          <DateTimePicker
            isOpen={showStartTime}
            onClose={() => setShowStartTime(false)}
            onSelect={(value) => handleDateChange(value, "startTime")}
            initialValue={localData.tipo_startTime}
            mode="time"
          />
        )}
      </div>

      {/* Fecha y Hora de Finalización */}
      <div className="relative">
        <DateTimeInput
          dateId="tipo_endDate"
          timeId="tipo_endTime"
          label="Fecha y Hora de Finalización *"
          dateValue={localData.tipo_endDate}
          timeValue={localData.tipo_endTime}
          onDateClick={() => setShowEndDate(true)}
          onTimeClick={() => setShowEndTime(true)}
          dateError={errors.end_date}
          timeError={errors.end_time}
        />
        {showEndDate && (
          <DateTimePicker
            isOpen={showEndDate}
            onClose={() => setShowEndDate(false)}
            onSelect={(value) => handleDateChange(value, "endDate")}
            initialValue={localData.tipo_endDate}
            mode="date"
          />
        )}
        {showEndTime && (
          <DateTimePicker
            isOpen={showEndTime}
            onClose={() => setShowEndTime(false)}
            onSelect={(value) => handleDateChange(value, "endTime")}
            initialValue={localData.tipo_endTime}
            mode="time"
          />
        )}
      </div>
    </div>
  );
};

export default TypeEventForm;
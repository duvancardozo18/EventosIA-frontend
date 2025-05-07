import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Label from '../../../../components/events/LabelForm';
import Input from '../../../../components/events/InputForm';

// 🔧 Utilidad local para convertir hora AM/PM a objeto Date
const parseTimeTo24hDate = (timeStr) => {
  if (!timeStr) return null;
  const [time, period] = timeStr.trim().split(' ');
  if (!time || !period) return null;
  let [hours, minutes] = time.split(':').map(Number);
  if (period.toLowerCase() === 'pm' && hours < 12) hours += 12;
  if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
  const date = new Date(1970, 0, 1, hours, minutes);
  return isNaN(date.getTime()) ? null : date;
};

const TypeEventForm = ({
  localData,
  errors,
  handleChange,
  handleNumberChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const modeOptions = [
    { value: 'virtual', label: 'Virtual' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'hibrido', label: 'Híbrido' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al cargar las categorías');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
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
          <div className="w-full h-11 bg-gray-100 animate-pulse rounded-lg" />
        ) : errorCategories ? (
          <p className="text-red-500 text-sm">{errorCategories}</p>
        ) : (
          <select
            id="tipo_eventType"
            value={localData.tipo_eventType}
            onChange={(e) => handleChange('tipo_eventType', e.target.value)}
            className={`w-full h-11 border px-4 py-2.5 text-sm rounded-lg ${
              errors.event_type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione el tipo de evento</option>
            {categories.map((cat) => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.event_type && (
          <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>
        )}
      </div>

      {/* Modalidad */}
      <div>
        <Label htmlFor="tipo_mode">Modalidad *</Label>
        <select
          id="tipo_mode"
          value={localData.tipo_mode}
          onChange={(e) => handleChange('tipo_mode', e.target.value)}
          className={`w-full h-11 border px-4 py-2.5 text-sm rounded-lg ${
            errors.mode ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Seleccione una modalidad</option>
          {modeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.mode && (
          <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="md:col-span-2">
        <Label htmlFor="tipo_description">Descripción *</Label>
        <textarea
          id="tipo_description"
          value={localData.tipo_description}
          onChange={(e) => handleChange('tipo_description', e.target.value)}
          rows={4}
          className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Participantes */}
      <div>
        <Label htmlFor="tipo_maxParticipants">Máximo de Participantes *</Label>
        <Input
          type="number"
          id="tipo_maxParticipants"
          value={localData.tipo_maxParticipants || ''}
          onChange={(e) => handleNumberChange('tipo_maxParticipants', e.target.value)}
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
          onChange={(e) => handleNumberChange('tipo_price', e.target.value)}
          min="0"
          step="0.01"
          className={`w-full ${errors.price ? 'border-red-500' : ''}`}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* Videoconferencia */}
      {['virtual', 'hibrido'].includes(localData.tipo_mode) && (
        <div className="md:col-span-2">
          <Label htmlFor="tipo_videoLink">Enlace de Videoconferencia *</Label>
          <Input
            type="url"
            id="tipo_videoLink"
            value={localData.tipo_videoLink}
            onChange={(e) => handleChange('tipo_videoLink', e.target.value)}
            placeholder="https://..."
            className={`w-full ${errors.video_Conference_Link ? 'border-red-500' : ''}`}
          />
          {errors.video_Conference_Link && (
            <p className="text-red-500 text-xs mt-1">{errors.video_Conference_Link}</p>
          )}
        </div>
      )}

      {/* Fecha y Hora de Inicio */}
      <div>
        <Label>Fecha de Inicio *</Label>
        <DatePicker
          selected={localData.tipo_startDate ? new Date(localData.tipo_startDate) : null}
          onChange={(date) => handleChange('tipo_startDate', date.toISOString().split('T')[0])}
          dateFormat="yyyy-MM-dd"
          className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
            errors.start_date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
      </div>
      <div>
        <Label>Hora de Inicio *</Label>
        <DatePicker
          selected={parseTimeTo24hDate(localData.tipo_startTime)}
          onChange={(date) => {
            const formatted = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            handleChange('tipo_startTime', formatted);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Hora"
          dateFormat="h:mm aa"
          className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
            errors.start_time ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
      </div>

      {/* Fecha y Hora de Fin */}
      <div>
        <Label>Fecha de Finalización *</Label>
        <DatePicker
          selected={localData.tipo_endDate ? new Date(localData.tipo_endDate) : null}
          onChange={(date) => handleChange('tipo_endDate', date.toISOString().split('T')[0])}
          dateFormat="yyyy-MM-dd"
          className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
            errors.end_date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
      </div>
      <div>
        <Label>Hora de Finalización *</Label>
        <DatePicker
          selected={parseTimeTo24hDate(localData.tipo_endTime)}
          onChange={(date) => {
            const formatted = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            handleChange('tipo_endTime', formatted);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Hora"
          dateFormat="h:mm aa"
          className={`w-full border px-4 py-2.5 text-sm rounded-lg ${
            errors.end_time ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
      </div>
    </div>
  );
};

export default TypeEventForm;
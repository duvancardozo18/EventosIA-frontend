import { useState, useRef } from "react";
import Label from "../../LabelForm";
import Input from "../../InputForm";
import {HiCurrencyDollar } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function LocationEvent() {
  // Estados para los campos del formulario
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  
  // Referencia para el input de archivo
  const fileInputRef = useRef(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  
  // Función para activar el input de archivo
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* id_type_of_event - Autogenerado, no se incluye en el formulario */}
          
          {/* Nombre del Evento (campo personalizado, no está en la BD) */}
          <div>
            <Label htmlFor="eventName">Nombre del Lugar</Label>
            <Input 
              type="text" 
              id="eventName" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full" 
            />
          </div>

          <div>
            <Label htmlFor="eventName">Dirección</Label>
            <Input 
            type="text" 
            id="eventName" 
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full" 
            />
         </div>

          {/* description - text */}
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
              placeholder="Descripción detallada del evento"
            />
          </div>

          {/* start_time - timestamp (separado en fecha y hora) */}
          <div>
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <div className="relative">
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona fecha de inicio"
                className="w-full h-11 rounded-lg border px-4 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300 pr-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="startTime">Hora de Inicio</Label>
            <div className="relative">
              <Input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pr-10"
              />
            </div>
          </div>

          {/* end_time - timestamp (separado en fecha y hora) */}
          <div>
            <Label htmlFor="endDate">Fecha de Finalización</Label>
            <div className="relative">
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona fecha de finalización"
                className="w-full h-11 rounded-lg border px-4 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300 pr-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endTime">Hora de Finalización</Label>
            <div className="relative">
              <Input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pr-10"
              />
            </div>
          </div>

          {/* price - decimal */}
          <div>
            <Label htmlFor="price">Precio</Label>
            <div className="relative">
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-8"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <HiCurrencyDollar className="size-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LocationEvent;
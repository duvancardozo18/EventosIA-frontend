import { useState } from "react";
import Label from "../../LabelForm";
import Input from "../../InputForm";
import Select from "../../SelectForm";
import { HiCalendar, HiEye, HiEyeOff, HiClock } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Asegurar que se carguen los estilos

function ParticipantsEvent() {
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para manejar la opción seleccionada en el Select
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { value: "Presencial", label: "Presencial" },
    { value: "Hibrido", label: "Hibrido" },
    { value: "Remoto", label: "Remoto" },
  ];

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleDateChange = (date) => {
    setDateOfBirth(date[0]?.toLocaleDateString());
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">

      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input Normal */}
          <div>
            <Label htmlFor="input">Nombre del Evento</Label>
            <Input type="text" id="input" className="w-full md:w-140" />
          </div>

          {/* Input con Placeholder */}
          <div>
            <Label htmlFor="inputTwo">Ubicación del Evento</Label>
            <Input type="text" id="inputTwo" placeholder="Ej: Ciudad, Dirección" className="w-full md:w-140" />
          </div>

          {/* Select Input con estado controlado y centrado */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <div className="w-full md:w-140">
              <Label>Tipo de Evento</Label>
              <select
                value={selectedOption}
                onChange={handleSelectChange}
                className="w-full h-11 rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
              >
                <option value="" disabled>Selecciona una opción</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password Input con Icono */}
          <div>
            <Label>Password Input</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full md:w-140 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <HiEye className="size-5" /> : <HiEyeOff className="size-5" />}
              </button>
            </div>
          </div>

          {/* Date Picker con Icono */}
          <div>
            <Label htmlFor="datePicker">Fecha del Evento</Label>
            <div className="relative">
              <DatePicker
                selected={dateOfBirth}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona una fecha"
                className="w-full md:w-80 h-11 rounded-lg border px-4 py-2.5 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300 pr-10"
                popperPlacement="bottom-start" // Asegurar que el calendario se muestre bien
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <HiCalendar className="size-6" />
              </span>
            </div>
          </div>

          {/* Time Picker - CENTRADO */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <div className="w-full md:w-140">
              <Label htmlFor="tm">Hora del Evento</Label>
              <div className="relative">
                <Input
                  type="time"
                  id="tm"
                  name="tm"
                  onChange={(e) => console.log(e.target.value)}
                  className="w-full pr-10"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <HiClock className="size-6" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ParticipantsEvent;
import { useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

function EventSubmission({ formData, validationErrors, onSubmit, isSubmitting }) {
  const [showSummary, setShowSummary] = useState(false);
  
  // Secciones del formulario para validación
  const sections = [
    { id: "evento", name: "Información General", isValid: !validationErrors.evento?.length },
    { id: "ubicacion", name: "Ubicación y Fechas", isValid: !validationErrors.ubicacion?.length },
    { id: "participantes", name: "Participantes", isValid: !validationErrors.participantes?.length },
    { id: "alimentacion", name: "Alimentación", isValid: !validationErrors.alimentacion?.length },
    { id: "recursos", name: "Recursos", isValid: !validationErrors.recursos?.length }
  ];
  
  // Verificar si todas las secciones son válidas
  const allSectionsValid = sections.every(section => section.isValid);
  
  // Manejar la creación del evento
  const handleCreateEvent = () => {
    if (allSectionsValid) {
      onSubmit(formData);
    } else {
      setShowSummary(true);
    }
  };
  
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Resumen y Confirmación</h2>
      
      {/* Resumen de validación */}
      {showSummary && (
        <div className="mb-8 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-lg font-medium">Estado de la Validación</h3>
          </div>
          <div className="divide-y">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between px-4 py-3">
                <span className="font-medium">{section.name}</span>
                <div className="flex items-center">
                  {section.isValid ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Completado</span>
                    </>
                  ) : (
                    <>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">Incompleto</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Errores detallados */}
          {!allSectionsValid && (
            <div className="bg-red-50 px-4 py-3 border-t">
              <h4 className="font-medium text-red-800 mb-2">Por favor complete los siguientes campos:</h4>
              <ul className="list-disc ml-5 text-sm text-red-700">
                {Object.entries(validationErrors).flatMap(([section, errors]) => 
                  errors.map((error, idx) => (
                    <li key={`${section}-${idx}`}>{error}</li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Resumen del evento (se puede expandir con más detalles) */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Resumen del Evento</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {formData.evento?.nombre && (
            <p className="mb-2"><span className="font-medium">Nombre:</span> {formData.evento.nombre}</p>
          )}
          {formData.evento?.tipo && (
            <p className="mb-2"><span className="font-medium">Tipo:</span> {formData.evento.tipo}</p>
          )}
          {formData.ubicacion?.lugar && (
            <p className="mb-2"><span className="font-medium">Lugar:</span> {formData.ubicacion.lugar}</p>
          )}
          {formData.participantes?.total && (
            <p className="mb-2"><span className="font-medium">Participantes:</span> {formData.participantes.total}</p>
          )}
          {/* Aquí puedes agregar más campos del resumen según necesites */}
        </div>
      </div>
      
      {/* Botón de creación con estado de carga */}
      <div className="flex justify-center">
        <button
          onClick={handleCreateEvent}
          disabled={isSubmitting}
          className={`
            px-6 py-3 rounded-lg text-white font-medium flex items-center
            ${allSectionsValid 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-blue-400"
            }
            ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
          `}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando evento...
            </>
          ) : (
            'Crear Evento'
          )}
        </button>
      </div>
    </div>
  );
}

export default EventSubmission;
import { useState, useRef } from "react";
import Input from "../../InputForm";
import { HiPlus, HiMinus, HiCurrencyDollar } from "react-icons/hi";

import "react-datepicker/dist/react-datepicker.css";

function ResourcesEvent() {
  
  // Estado para los recursos seleccionados
  const [selectedResources, setSelectedResources] = useState([
    { id: 1, name: "", quantity: 1 }
  ]);
  
  // Lista de recursos disponibles (simulada)
  const availableResources = [
    { id_resource: 1, name: "Proyector", description: "Proyector HD", quantity_available: 10, price: 50.00 },
    { id_resource: 2, name: "Silla", description: "Silla plegable", quantity_available: 200, price: 5.00 },
    { id_resource: 3, name: "Mesa", description: "Mesa rectangular", quantity_available: 50, price: 15.00 },
    { id_resource: 4, name: "Micrófono", description: "Micrófono inalámbrico", quantity_available: 20, price: 25.00 },
    { id_resource: 5, name: "Altavoz", description: "Altavoz potente", quantity_available: 15, price: 45.00 }
  ];
  
  // Función para agregar un nuevo recurso
  const addResource = () => {
    setSelectedResources([...selectedResources, { id: null, name: "", quantity: 1 }]);
  };
  
  // Función para eliminar un recurso
  const removeResource = (index) => {
    if (selectedResources.length > 1) {
      const updatedResources = [...selectedResources];
      updatedResources.splice(index, 1);
      setSelectedResources(updatedResources);
    }
  };
  
  // Función para cambiar el recurso seleccionado
  const handleResourceChange = (index, resourceId) => {
    const updatedResources = [...selectedResources];
    const selectedResource = availableResources.find(resource => resource.id_resource === parseInt(resourceId));
    updatedResources[index] = {
      ...updatedResources[index],
      id: selectedResource ? selectedResource.id_resource : null,
      name: selectedResource ? selectedResource.name : ""
    };
    setSelectedResources(updatedResources);
  };
  
  // Función para cambiar la cantidad
  const handleQuantityChange = (index, quantity) => {
    const updatedResources = [...selectedResources];
    updatedResources[index].quantity = parseInt(quantity);
    setSelectedResources(updatedResources);
  };
  
  // Calcular el total
  const calculateTotal = () => {
    return selectedResources.reduce((total, item) => {
      const resourceItem = availableResources.find(resource => resource.id_resource === item.id);
      return total + (resourceItem ? resourceItem.price * item.quantity : 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">

        {/* Sección de Recursos */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Recursos para el Evento</h3>
            <button 
              type="button"
              onClick={addResource}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              <HiPlus className="size-4" />
              <span>Agregar recurso</span>
            </button>
          </div>
          
          {/* Encabezados de tabla */}
          <div className="grid grid-cols-12 gap-4 mb-2 px-2 font-medium text-sm text-gray-600">
            <div className="col-span-5">Recurso</div>
            <div className="col-span-2">Cantidad</div>
            <div className="col-span-3">Precio unitario</div>
            <div className="col-span-2">Subtotal</div>
          </div>
          
          {/* Filas de recursos */}
          {selectedResources.map((resource, index) => {
            const resourceData = availableResources.find(item => item.id_resource === resource.id) || {};
            const subtotal = resourceData.price ? (resourceData.price * resource.quantity).toFixed(2) : "0.00";
            
            return (
              <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                {/* Selector de recurso */}
                <div className="col-span-5">
                  <select
                    value={resource.id || ""}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    className="w-full h-11 rounded-lg border px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
                  >
                    <option value="">Seleccione un recurso</option>
                    {availableResources.map(item => (
                      <option key={item.id_resource} value={item.id_resource} disabled={item.quantity_available <= 0}>
                        {item.name} {item.quantity_available <= 0 ? "(No disponible)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Cantidad */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    max={resourceData.quantity_available || 999}
                    value={resource.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-full text-center"
                  />
                </div>
                
                {/* Precio unitario */}
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center text-gray-700">
                    <HiCurrencyDollar className="size-4" />
                    <span>{resourceData.price ? resourceData.price.toFixed(2) : "0.00"}</span>
                  </div>
                </div>
                
                {/* Subtotal y botón eliminar */}
                <div className="col-span-2 flex items-center justify-between">
                  <div className="text-gray-700">${subtotal}</div>
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Eliminar"
                  >
                    <HiMinus className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Total */}
          <div className="mt-4 border-t pt-4 flex justify-end items-center">
            <div className="font-medium text-gray-800 mr-4">Total:</div>
            <div className="text-xl font-semibold">${calculateTotal()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesEvent;
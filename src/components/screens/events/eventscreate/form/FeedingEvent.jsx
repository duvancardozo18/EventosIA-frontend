import { useState, useRef } from "react";
import Input from "../../InputForm";
import { HiPlus, HiMinus, HiCurrencyDollar } from "react-icons/hi";

import "react-datepicker/dist/react-datepicker.css";

function FeedingEvent() {
  
  // Estado para los alimentos seleccionados
  const [selectedFoods, setSelectedFoods] = useState([
    { id: 1, name: "", quantity: 1 }
  ]);
  
  // Lista de alimentos disponibles (simulada)
  const availableFoods = [
    { id: 1, name: "Pizza", description: "Pizza tradicional", quantity_available: 50, price: 8.99 },
    { id: 2, name: "Hamburguesa", description: "Hamburguesa clásica", quantity_available: 40, price: 7.50 },
    { id: 3, name: "Ensalada", description: "Ensalada mixta", quantity_available: 30, price: 5.99 },
    { id: 4, name: "Pasta", description: "Pasta con salsa", quantity_available: 25, price: 9.50 },
    { id: 5, name: "Taco", description: "Taco mexicano", quantity_available: 60, price: 3.99 }
  ];
  
  // Función para agregar un nuevo alimento
  const addFood = () => {
    setSelectedFoods([...selectedFoods, { id: null, name: "", quantity: 1 }]);
  };
  
  // Función para eliminar un alimento
  const removeFood = (index) => {
    if (selectedFoods.length > 1) {
      const updatedFoods = [...selectedFoods];
      updatedFoods.splice(index, 1);
      setSelectedFoods(updatedFoods);
    }
  };
  
  // Función para cambiar el alimento seleccionado
  const handleFoodChange = (index, foodId) => {
    const updatedFoods = [...selectedFoods];
    const selectedFood = availableFoods.find(food => food.id === parseInt(foodId));
    updatedFoods[index] = {
      ...updatedFoods[index],
      id: selectedFood ? selectedFood.id : null,
      name: selectedFood ? selectedFood.name : ""
    };
    setSelectedFoods(updatedFoods);
  };
  
  // Función para cambiar la cantidad
  const handleQuantityChange = (index, quantity) => {
    const updatedFoods = [...selectedFoods];
    updatedFoods[index].quantity = parseInt(quantity);
    setSelectedFoods(updatedFoods);
  };
  
  // Calcular el total
  const calculateTotal = () => {
    return selectedFoods.reduce((total, item) => {
      const foodItem = availableFoods.find(food => food.id === item.id);
      return total + (foodItem ? foodItem.price * item.quantity : 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl border border-gray-300">

        {/* Sección de Alimentos */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Alimentos para el Evento</h3>
            <button 
              type="button"
              onClick={addFood}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              <HiPlus className="size-4" />
              <span>Agregar alimento</span>
            </button>
          </div>
          
          {/* Encabezados de tabla */}
          <div className="grid grid-cols-12 gap-4 mb-2 px-2 font-medium text-sm text-gray-600">
            <div className="col-span-5">Alimento</div>
            <div className="col-span-2">Cantidad</div>
            <div className="col-span-3">Precio unitario</div>
            <div className="col-span-2">Subtotal</div>
          </div>
          
          {/* Filas de alimentos */}
          {selectedFoods.map((food, index) => {
            const foodData = availableFoods.find(item => item.id === food.id) || {};
            const subtotal = foodData.price ? (foodData.price * food.quantity).toFixed(2) : "0.00";
            
            return (
              <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-center">
                {/* Selector de alimento */}
                <div className="col-span-5">
                  <select
                    value={food.id || ""}
                    onChange={(e) => handleFoodChange(index, e.target.value)}
                    className="w-full h-11 rounded-lg border px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 border-gray-300"
                  >
                    <option value="">Seleccione un alimento</option>
                    {availableFoods.map(item => (
                      <option key={item.id} value={item.id} disabled={item.quantity_available <= 0}>
                        {item.name} {item.quantity_available <= 0 ? "(Agotado)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Cantidad */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    max={foodData.quantity_available || 999}
                    value={food.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-full text-center"
                  />
                </div>
                
                {/* Precio unitario */}
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center text-gray-700">
                    <HiCurrencyDollar className="size-4" />
                    <span>{foodData.price ? foodData.price.toFixed(2) : "0.00"}</span>
                  </div>
                </div>
                
                {/* Subtotal y botón eliminar */}
                <div className="col-span-2 flex items-center justify-between">
                  <div className="text-gray-700">${subtotal}</div>
                  <button
                    type="button"
                    onClick={() => removeFood(index)}
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

export default FeedingEvent;
import React, { useState } from "react";
import axios from "axios";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ResetPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/request-password-reset`, formData);
      console.log("Respuesta del servidor:", response.data);
      
      if (response.status === 200 ) {
        Swal.fire({
          title: "Correo Enviado",
          text: "Revisa la bandeja de entrada de tu correo",
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false
        });
      } else {
        setError("El correo ingresado no está registrado.");
      }
    } catch (error) {
      console.error("Error en la recuperación de contraseña:", error);
      setError(error.response?.data?.error || "Hubo un problema con la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#d9e6f5] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Recuperar Contraseña</h1>
          <p className="text-gray-600">
            Introduzca su dirección de correo electrónico para recibir un enlace de recuperación.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ingrese su correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#365486] hover:bg-[#344663] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>

          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

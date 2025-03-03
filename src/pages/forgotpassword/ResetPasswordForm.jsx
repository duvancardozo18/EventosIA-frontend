import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import recoverPassword from "../../assets/recover-password.png";

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setError("Token inválido o expirado.");
    }
  }, [token]);

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };

    setPasswordValidations(validations);

    return Object.values(validations).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { newPassword, confirmNewPassword } = formData;

    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe cumplir con todos los requisitos."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/reset-password/`, {
         token,
         newPassword 
        });

      if (response.status === 200) {
        Swal.fire({
          title: "Contraseña actualizada",
          text: "Ahora puedes iniciar sesión con tu nueva contraseña.",
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false
        }).then(() => navigate("/login"));
      } else {
        setError(response.data.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error("Error en la actualización de contraseña:", error);
      setError(error.response?.data?.message || "Hubo un problema con la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen bg-[#d9e6f5]">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <img src={recoverPassword} className="h-50 w-60 object-contain rounded-2xl" alt="Recuperar contraseña" />
          <h1 className="text-xl font-semibold mb-2">Ingresar nueva contraseña</h1>
          <p className="text-gray-600">Ingrese su nueva contraseña a continuación para recuperar el acceso a su cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              required
            />
            <ul className="mt-2 text-sm">
              <li className={passwordValidations.length ? "text-green-600" : "text-red-600"}>
                {passwordValidations.length ? "✔" : "✖"} Mínimo 8 caracteres
              </li>
              <li className={passwordValidations.uppercase ? "text-green-600" : "text-red-600"}>
                {passwordValidations.uppercase ? "✔" : "✖"} Al menos una letra mayúscula
              </li>
              <li className={passwordValidations.lowercase ? "text-green-600" : "text-red-600"}>
                {passwordValidations.lowercase ? "✔" : "✖"} Al menos una letra minúscula
              </li>
              <li className={passwordValidations.number ? "text-green-600" : "text-red-600"}>
                {passwordValidations.number ? "✔" : "✖"} Al menos un número
              </li>
              <li className={passwordValidations.specialChar ? "text-green-600" : "text-red-600"}>
                {passwordValidations.specialChar ? "✔" : "✖"} Al menos un carácter especial (@$!%*?&)
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {message && <p className="text-center text-green-500 mb-4">{message}</p>}

          <div className="flex items-center justify-between">
            <button
              className="bg-[#365486] hover:bg-[#344663] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
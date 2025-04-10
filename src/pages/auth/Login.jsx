import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import InputItem from '../../components/InputItem';
import axiosInstance from '../../config/axiosInstance';
import { AuthContext } from '../../config/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext); // Usa la función de login del contexto
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) return setError("Por favor completa todos los campos");
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post('/login', {
        email,
        password
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      // Storing token and updating auth context
      localStorage.setItem('access_token', data.token);
      login(data.token); // Utiliza la función login del contexto para guardar el token
      //console.log("Token guardado:", data.token);

      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Error en el servidor');
      } else if (err.request) {
        setError('No hay respuesta del servidor. Verifica tu conexión.');
      } else {
        setError('Error desconocido. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] bg-white flex shadow-lg rounded-md p-10">

        {/* Sección de imagen (solo visible en pantallas grandes) */}
        <div className="hidden lg:w-[50%] lg:flex flex-col items-center justify-center border-r border-gray-300">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="lg:w-[80%] max-h-[500px] object-contain"
            alt="Sample image"
          />
        </div>

        {/* Sección de formulario */}
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-2">
          <h1 className="text-4xl font-bold mb-5 text-center">INICIO DE SESIÓN</h1>
          {error && (
            <span className="w-[70%] text-sm text-center py-2 mb-2 bg-[#FFA7A9] rounded-lg text-gray-600 flex gap-5 items-center justify-center mx-auto px-5 whitespace-pre-line">
              {error}
            </span>
          )}


          <form className="flex flex-col w-full sm:w-[90%] items-center" onSubmit={handleLogin}>
            <InputItem
              id="email"
              labelName="Correo electrónico"
              placeholder="Ingresa tu correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputItem
              id="password"
              labelName="Contraseña"
              placeholder="Ingresa tu contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="w-full lg:w-[80%] flex justify-end">
              <a href="/reset-password" className="font-semibold text-md hover:underline">Olvidé mi contraseña</a>
            </div>

            <button
              type="submit"
              className={`w-[80%] sm:w-[45%] mt-4 bg-[#365486] text-white py-2 px-2 rounded-lg transition-all duration-300 ease-in-out ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#344663]"}`}
            >
              INICIAR SESIÓN
            </button>
          </form>

          <div className="flex-row sm:flex text-center mt-2 gap-2">
            <p>¿No tienes cuenta?</p>
            <a href="/register" className="font-semibold text-md hover:underline text-[#8d9bd6]">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

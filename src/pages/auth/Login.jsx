import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputItem from '../../components/InputItem';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem('token', data.token);

      navigate('/home');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Error en el servidor');
      } else if (err.request) {
        setError('No hay respuesta del servidor. Verifica tu conexión.');
      } else {
        setError('Error desconocido. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] bg-white flex shadow-lg rounded-md p-10">

        <div className="hidden lg:w-[50%] lg:flex flex-col items-center justify-center border-r border-gray-300">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="lg:w-[80%] max-h-[500px] object-contain"
            alt="Sample image"
          />
        </div>

        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-2">
          <h1 className="text-4xl font-bold mb-5 text-center">INICIO DE SESIÓN</h1>

          {error && <p className="text-red-500">{error}</p>}

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
              <a href="#" className="font-semibold text-md hover:underline">Olvidé mi contraseña</a>
            </div>

            <button
              type="submit"
              className="w-[80%] sm:w-[45%] mt-4 bg-[#365486] text-white py-2 px-2 rounded-lg hover:bg-[#344663] hover:scale-105 transition-all duration-300 ease-in-out"
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

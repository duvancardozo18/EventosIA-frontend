import React from 'react';
import InputItem from '../components/InputItem';

const Register = () => {
  return (
    <div className="w-full h-full min-h-screen bg-[#d9e6f5] flex flex-col items-center justify-center">
      <div className="w-[70%] bg-white flex shadow-lg rounded-md p-10">
        
        <div className="hidden  lg:w-[50%] lg:flex flex-col items-center justify-center border-r border-gray-300">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="lg:w-[80%] max-h-[500px] object-contain"
            alt="Sample image"
          />
        </div>

        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-2">
          <h1 className="text-4xl font-bold mb-10 text-center">REGISTRATE</h1>
          <form className="flex flex-col w-full sm:w-[90%] items-center">
            <InputItem
              id="name"
              labelName="Nombre"
              placeholder="Ingresa tu nombre"
              type="name"
            />
            <InputItem
              id="last-name"
              labelName="Apellido"
              placeholder="Ingresa tus apellidos"
              type="last-name"
            />
            <InputItem
              id="email"
              labelName="Correo electrónico"
              placeholder="Ingresa tu correo"
              type="email"
            />
            <InputItem
              id="password"
              labelName="Contraseña"
              placeholder="Ingresa tu contraseña"
              type="password"
            />

            <button
              type="submit"
              className="w-[80%] sm:w-[45%] mt-4 bg-[#365486] text-white py-2 px-2 rounded-lg hover:bg-[#344663] hover:scale-105 transition-all duration-300 ease-in-out"
            >
              REGISTRARSE
            </button>
          </form>
          <div className="flex-row sm:flex  text-center mt-2 gap-2">
            <p>¿Ya tienes cuenta?</p>
            <a href="/login" className="font-semibold text-md hover:underline text-[#8d9bd6]">Inicia Sesión</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;

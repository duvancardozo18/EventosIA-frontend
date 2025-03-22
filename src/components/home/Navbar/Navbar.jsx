import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md" id='home'>
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-900">EventosIA</h1>

      {/* Menú en desktop */}
      <div className="hidden md:flex gap-6">
        <a href="#home" className="text-blue-900 flex items-center">Incio</a>
        <a href="#services" className="text-blue-900 flex items-center">Servicios</a>
        <a href="#contact" className="text-blue-900 flex items-center">Contacto</a>
        <a href="/login" className="bg-[#365486] text-white px-6 py-2 rounded shadow hover:bg-[#2a3f68] cursor-pointer">
        Ingresar
        </a>
      </div>

      {/* Icono de hamburguesa (toggle menu) */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-blue-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Menú desplegable (toggle) */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4 flex flex-col items-center gap-4">
          <a href="#about" className="text-blue-900">Servicios</a>
          <a href="#mission" className="text-blue-900">Evento</a>
          <a href="#product" className="text-blue-900">Ingresar</a>
          <a href="/login" className="bg-[#365486] text-white px-6 py-2 rounded shadow hover:bg-purple-700 cursor-pointer">
            Ingresar
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

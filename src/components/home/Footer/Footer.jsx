import React from 'react';

const Footer = () => {
  return (
    <div className="">
      <footer className="bg-gray-100 px-8 py-12 text-sm text-blue-900 ">
        {/* Secciones superiores */}
        <div className=" flex items-center grid grid-cols-1 md:grid-cols-4 gap-1 mb-1">
          {/* Image Section */}
          <div className="flex justify-center md:justify-start">
            <img src="img/logo.webp" className="h-66 w-66" />
          </div>

          {/* Contact */}
          <div className="border-gray-300 pb-4">
            <h4 className="font-bold mb-4 text-2xl">Enlaces</h4>
            <a href='#home' className="mb-1 text-xl">Incio</a><br />
            <a href='#services' className="mb-1 text-xl">Servicios</a><br />
            <a href='#contact' className="mb-1 text-xl">Contacto</a>
          </div>

          {/* Address */}
          <div className="border-gray-300 pb-4 ">
            <h4 className="font-bold mb-4 text-2xl">Dirección</h4>
            <p className='text-xl'>Rancho Santa Margarita</p>
            <p className='text-xl'>2131 Elk Street</p>
            <p className='text-xl'>California</p>
          </div>

          {/* Policy */}
          <div className="border-gray-300 pb-4">
            <h4 className="font-bold mb-4 text-2xl">Politica</h4>
            <ul className="space-y-1">
              <li  className='text-xl'>Política de Privacidad</li>
              <li className='text-xl'>Términos y Condiciones</li>
              <li className='text-xl'>Política de Cookies</li>
              
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Sección inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">EventosIA</h2>

          <div className="flex gap-4 items-center">
            <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/github.png" alt="GitHub" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-filled/30/linkedin.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-[#365486] text-center  text-gray-100 w-full py-4">
        <p>&copy; 2025 EventosIA. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

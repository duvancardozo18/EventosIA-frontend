import React, { useState } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';

function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Handle submission logic here
    console.log(email, verificationCode);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#d9e6f5] p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Recuperar Contraseña</h1>
          <p className='text-gray-600'>Introduzca su dirección de correo electrónico a continuación para recibir un enlace para crear una nueva contraseña.</p>
        </div>
        <div className='bg-white shadow-md rounded-lg p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col'>
              <label htmlFor='email' className='text-sm font-medium text-gray-700'>Correo Electrónico</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiMail className='h-5 w-5 text-gray-400' />
                </div>
                <input type='email' name='email' id='email' className='focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md' placeholder='Ingrese su correo electrónico' value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className='flex justify-end text-sm text-[#344663] hover:text-[#365486] cursor-pointer'>Reenviar enlace</div>
            <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#365486] hover:bg-[#344663] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'>Enviar link</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;
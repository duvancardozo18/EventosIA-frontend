import { useState } from 'react';
import { AiFillLock } from 'react-icons/ai';
import recoverPassword2 from '../../assets/recover-password2.png';

function ResetPasswordForm() {
  const [formData, setFormData] = useState({ newPassword: '', confirmNewPpassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className='flex flex-wrap justify-center items-center min-h-screen bg-[#d9e6f5]'>
      <div className='w-full max-w-md mx-auto '>
        <div className='text-center mb-10 flex flex-col items-center justify-center'>
        <img src="/assets/recover-password2.png" className='h-50 w-60 object-contain'/>
          <h1 className='text-xl font-semibold mb-2'>Ingresar nueva contraseña.</h1>
          <p className='text-gray-600'>Ingrese su nueva contraseña a continuación para recuperar el acceso a su cuenta.</p>
        </div>
        <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='newPassword'>Nueva contraseña</label>
            <input type='password' name='newPassword' id='newPassword' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={handleChange} required />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='confirmNewPassword'>Confirmar nueva contraseña</label>
            <input type='password' name='confirmNewPassword' id='confirmNewPassword' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={handleChange} required />
          </div>
          <div className='flex items-center justify-between'>
            <button className='bg-[#365486] hover:bg-[#344663] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>Enviar</button>
            <a className='inline-block align-baseline font-bold text-sm text-[#344663] hover:text-[#365486]' href='#'>Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
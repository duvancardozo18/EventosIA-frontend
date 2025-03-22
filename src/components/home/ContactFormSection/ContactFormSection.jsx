import React, { useState } from 'react';

const ContactFormSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías hacer una petición POST o mostrar un mensaje
    console.log('Form submitted:', form);
  };

  return (
    <section className="px-8 py-20 flex flex-col md:flex-row items-start justify-between gap-12" id="contact">
      {/* Texto izquierda */}
      <div className="md:w-1/2">
        <h2 className="p-3 text-4xl font-bold text-blue-900 mb-4">Contacto</h2>
        <p className=" text-lg">
        ¿Tienes alguna pregunta sobre nuestro sistema de gestión de eventos con planificación automática? <br /> <br />Ya sea que necesites más información, soporte o quieras saber cómo implementar nuestra solución en tu próximo evento, nuestro equipo está listo para asistirte.
        <br /><br /> <strong>No dudes en contactarnos, ¡nos encantaría ayudarte a llevar tu evento al siguiente nivel!</strong>
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="md:w-1/2 w-full flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            placeholder=""
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 rounded outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
          <input
            type="email"
            name="email"
            placeholder=""
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 rounded outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea
            name="message"
            placeholder=""
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 rounded outline-none h-40 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="self-end bg-[#365486] text-white px-8 py-3 rounded shadow-lg "
        >
          Enviar
        </button>
      </form>
    </section>
  );
};

export default ContactFormSection;

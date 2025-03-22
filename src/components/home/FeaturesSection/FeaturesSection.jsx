import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="bg-gray-100 px-6 py-12 md:px-16 md:py-20 flex flex-col md:flex-row" id='services'>
      {/* Texto */}
      <div className="w-full ">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 md:text-left">
          Servicios
        </h2>
        <p className="text-base md:text-lg mb-8 md:text-left">
          Nuestro sistema de gestión de eventos con planificación automática está diseñado para facilitar la organización y ejecución de eventos. Con solo unos clics, puedes automatizar la planificación y garantizar un evento exitoso.
        </p>

        {/* Mini cards con servicios */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center md:justify-center">
          {/* Servicio 1: Planificación Automática */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-80">
            <img
              src="https://img.icons8.com/ios-filled/50/FF6A00/calendar.png"
              alt="Planificación Automática"
              className="w-16 mb-4 mx-auto"
            />
            <h4 className="font-semibold text-gray-800 text-center">Planificación Automática</h4>
            <p className="text-sm text-gray-600 text-center">
              Automatiza la programación de tareas, recordatorios y recursos necesarios para tus eventos sin esfuerzo manual.
            </p>
          </div>

          {/* Servicio 2: Gestión de Usuario */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-80">
            <img
              src="https://img.icons8.com/ios-filled/50/FF6A00/user.png" // Cambié el ícono aquí
              alt="Gestión de Usuario"
              className="w-16 mb-4 mx-auto"
            />
            <h4 className="font-semibold text-gray-800 text-center">Gestión de Usuario</h4>
            <p className="text-sm text-gray-600 text-center">
              Administra fácilmente tus usuarios, asigna roles y gestiona sus permisos para un control total.
            </p>
          </div>

          {/* Servicio 3: Reportes en Tiempo Real */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-80">
            <img
              src="https://img.icons8.com/ios-filled/50/FF6A00/bar-chart.png"
              alt="Reportes en Tiempo Real"
              className="w-16 mb-4 mx-auto"
            />
            <h4 className="font-semibold text-gray-800 text-center">Reportes en Tiempo Real</h4>
            <p className="text-sm text-gray-600 text-center">
              Visualiza y controla el progreso de tu evento en tiempo real, con datos precisos y gráficos que te ayudan a tomar decisiones rápidas.
            </p>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default FeaturesSection;

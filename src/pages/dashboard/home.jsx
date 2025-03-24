import React, { useContext } from 'react'; // Importa useContext desde react
import { AuthContext } from "../../config/AuthProvider";

const Dashboard = () => {
  const { permissions, loading } = useContext(AuthContext); // Obtén permissions y loading desde el contexto

  // Función para verificar permisos
  const hasPermission = (permission) => {
    if (loading) {
      return false; // Si los permisos aún se están cargando, no verificamos permisos
    }
    if (!permissions || !Array.isArray(permissions)) {
      return false; // Si permissions no está definido o no es un array, retorna false
    }
    return permissions.some((perm) => perm.name === permission); // Verifica si algún permiso coincide
  };

  if (loading) {
    return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga mientras se obtienen los datos
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido al Dashboard</h1>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admin */}
        {hasPermission("manage_events") && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Rol: Gestor de eventos</h2>
          </div>
        )}
       
        {/* Usuario */}
        {hasPermission("accept_invitation") && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Rol: Cliente</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Componente proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false); // Nuevo estado para controlar la inicialización
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para decodificar el JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Función para inicializar la autenticación
  const checkBackendStatus = async () => {
    try {
      const response = await axiosInstance.get('/'); // Ruta de salud del backend
      return response.status === 200;
    } catch (error) {
      console.error('Error al verificar el estado del backend:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true); // Asegúrate de que loading sea true al inicio
      const backendReady = await checkBackendStatus(); // Verifica si el backend está listo
  
      if (!backendReady) {
        setError('El backend no está disponible. Por favor, inténtelo más tarde.');
        setLoading(false); // Si el backend no está disponible, termina la carga
        return;
      }
  
      // Obtén el token del localStorage
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = parseJwt(token);
  
        // Verifica si el token es válido y no ha expirado
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setUserId(decodedToken.sub);
          setEmail(decodedToken.email || '');
  
          try {
            await fetchUserData(decodedToken.email); // Llama al backend para obtener datos adicionales
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
            setError('Error al cargar los datos del usuario. Por favor, inténtelo de nuevo.');
            setIsAuthenticated(false);
          }
        } else {
          console.warn('El token es inválido o ha expirado');
          localStorage.removeItem('access_token'); // Limpia el token inválido
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Asegúrate de que loading sea false al finalizar
      setAuthInitialized(true); // Marca la autenticación como completada
    };
  
    initializeAuth();
  }, []);

  // Función para obtener datos del usuario desde el backend
  const fetchUserData = async (email) => {
    try {
      const roleResponse = await axiosInstance.get(`/users/${email}`);
      if (roleResponse.status === 200) {
        const usuario = roleResponse.data.usuario;
        const { id_role } = usuario;

        // Obtener el rol y permisos utilizando el rol_id
        const roleDetailsResponse = await axiosInstance.get(`/roles/${id_role}`);
        if (roleDetailsResponse.status === 200) {
          const { role } = roleDetailsResponse.data;
          setRole(role.name);
          setPermissions(role.permissions); // Asigna los permisos correctamente
        } else {
          console.error('Error al obtener los detalles del rol:', roleDetailsResponse.status);
          setError('Error al cargar los detalles del rol. Por favor, inténtelo de nuevo.');
        }
      } else {
        console.error('Error al obtener el rol del usuario:', roleResponse.status);
        setError('Error al cargar el rol del usuario. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario-rol:', error);
      setError('Error al cargar los datos del usuario. Por favor, inténtelo de nuevo.');
    }
  };

  // Función para manejar el login
  const login = async (token) => {
    try {
      localStorage.setItem('access_token', token);
      setIsAuthenticated(true);
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.sub) {
        setUserId(decodedToken.sub);
        setEmail(decodedToken.email || '');
        await fetchUserData(decodedToken.email);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setError('Error durante el login. Por favor, inténtelo de nuevo.');
    }
  };

  // Función para manejar el logout
  const logout = () => {
    try {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setUserId(null);
      setEmail(null);
      setRole(null);
      setPermissions([]);
      setError(null); // Limpia cualquier error al hacer logout
    } catch (error) {
      console.error('Error durante el logout:', error);
      setError('Error durante el logout. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        email,
        permissions,
        role,
        loading,
        authInitialized,
        error, // Proporciona el estado de error al contexto
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
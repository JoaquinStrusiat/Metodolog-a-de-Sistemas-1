import { useState, useEffect } from 'react';

// Hook personalizado para manejar los datos del usuario
export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState([]);

  // Función para actualizar el estado basado en localStorage
  const refreshUserData = () => {
    const storedUserData = localStorage.getItem('userData');
    const storedContactSubmissions = localStorage.getItem('contactSubmissions');
    
    // Procesar datos de usuario
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        localStorage.removeItem('userData');
        setUserData(null);
        setIsLoggedIn(false);
      }
    } else {
      setUserData(null);
      setIsLoggedIn(false);
    }
    
    // Procesar datos de contacto
    if (storedContactSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(storedContactSubmissions);
        setContactSubmissions(Array.isArray(parsedSubmissions) ? parsedSubmissions : [parsedSubmissions]);
      } catch (error) {
        console.error("Error al parsear datos de contacto:", error);
        setContactSubmissions([]);
      }
    } else {
      setContactSubmissions([]);
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    refreshUserData();
    
    // Agregar un event listener para detectar cambios en localStorage
    // Esto permite que múltiples componentes se actualicen si cambia el usuario
    const handleStorageChange = () => {
      refreshUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setIsLoggedIn(false);
    
    // Disparar un evento de storage para que otros componentes se enteren
    window.dispatchEvent(new Event('storage'));
  };

  // Función para actualizar datos de usuario
  const updateUserData = (newData) => {
    if (userData) {
      const updatedData = { ...userData, ...newData };
      localStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
      
      // Disparar evento de storage para actualizar todos los componentes
      window.dispatchEvent(new Event('storage'));
    }
  };

  return { 
    userData, 
    isLoggedIn, 
    contactSubmissions,
    logout, 
    refreshUserData,
    updateUserData
  };
};
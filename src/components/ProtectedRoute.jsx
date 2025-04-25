import { Navigate, useLocation } from "react-router-dom";
import { useUserData } from "../hooks/hook";

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useUserData();
  const location = useLocation();
  
  // Si no está logueado, redirigir al login y guardar la ubicación para redirigir después
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Si hay datos de usuario, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;
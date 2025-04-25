import Form from "@/components/form";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Login() {
  const location = useLocation();
  const redirectAfterLogin = location.state?.from || '/';

  useEffect(() => {
    const styleId = "water-effect-style";
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = `
        .page-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        #svg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -2;
          pointer-events: none;
        }

        #distorted-image {
          filter: url("#disFilter");
        }

        /* Estilo para el texto exterior */
        .text-white {
          color: white;
        }

        /* Sombreado oscuro fino en el título */
        .title-shadow {
          text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
        }

        /* Texto blanco y rosa debajo del formulario */
        .text-white-bottom {
          color: white;
        }

        .text-white-bottom a {
          color: pink; /* Enlace rosa */
        }
      `;
      document.head.appendChild(styleTag);
    }

    const turbulence = document.querySelector('#disFilter feTurbulence');
    let frameId;
    let base = 0.005;
    let direction = 1;

    const animate = () => {
      if (!turbulence) return;

      base += direction * 0.00002;
      if (base >= 0.01 || base <= 0.004) direction *= -1;

      turbulence.setAttribute('baseFrequency', base.toString());
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  // Función para manejar el inicio de sesión y buscar datos completos del usuario
  const customLoginLogic = async (formData) => {
    // Buscar datos del usuario en localStorage
    const storedUsers = localStorage.getItem('allUsers');
    let users = [];
    
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
    
    // Verificar credenciales y obtener datos completos
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      // Si se encuentra el usuario, devolver todos sus datos
      return {
        ...user,
        id: user.id || `user_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
    } else {
      // Si no existe un usuario registrado con esas credenciales,
      // simulamos que se ha cargado la información (para desarrollo)
      // En un entorno real, esto debería ser un error de autenticación
      return {
        email: formData.email,
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
    }
  };

  const loginContext = {
    title: "Iniciar sesión",
    inputs: [
      {
        tag: 'input',
        type: 'email',
        id: 'email',
        name: 'email',
        placeholder: 'Correo electrónico',
        required: true
      },
      {
        tag: 'input',
        type: 'password',
        id: 'password',
        name: 'password',
        placeholder: 'Contraseña',
        required: true
      }
    ],
    service: 'loginForm',
    style: { maxWidth: '400px', margin: '0 auto' },
    className: 'shadow p-4',
    messages: {
      success: {
        show: true,
        text: "¡Bienvenido! Iniciando sesión..."
      },
      error: {
        show: true,
        text: "Error al iniciar sesión. Verifique sus credenciales."
      }
    },
    setData: {
      save: true,
      key: 'userData'
    },
    customLoginLogic: customLoginLogic, // Función personalizada para manejar el login
    redirectPath: redirectAfterLogin // Redirigir a la página original o a inicio
  };

  return (
    <div className="page-container">
      <svg id="svg">
        <defs>
          <filter id="disFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.005"
              numOctaves="3"
              seed="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displacement"
            />
          </filter>
        </defs>

        <image
          id="distorted-image"
          xlinkHref="https://github.com/SebastianPanozzo/spa-proyecto/blob/master/Metodolog-a-de-Sistemas-1/public/imagenes/fondo_Register_login.jpeg?raw=true"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          preserveAspectRatio="none"
        />
      </svg>

      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-white title-shadow">Bienvenido de nuevo</h2>
              <p className="text-white title-shadow">Ingresa tus datos para acceder a tu cuenta</p>
            </div>

            <div className="form-container">
              <Form context={loginContext} />
            </div>

            <div className="text-center mt-3">
              <p className="text-white-bottom">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-white-bottom">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
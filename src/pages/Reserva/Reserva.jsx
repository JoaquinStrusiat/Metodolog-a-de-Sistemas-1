import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Form from "@/components/form";
import { useUserData } from "@/hooks/hook";
import { serviceDetails } from "@/utiles/data";

function Reserva() {
  const { serviceId, categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useUserData();
  const [serviceInfo, setServiceInfo] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // Verificar si el usuario está logueado y redirigir si no lo está
  useEffect(() => {
    if (!isLoggedIn) {
      // Mostrar mensaje temporal antes de redirigir
      setShowLoginMessage(true);
      
      // Retraso corto para que el usuario vea el mensaje antes de redirigir
      const redirectTimer = setTimeout(() => {
        // Guarda la página actual y el servicio para redireccionar después del login
        navigate("/login", { 
          state: { 
            from: location.pathname,
            serviceId: serviceId,
            categoryId: categoryId,
            service: location.state?.service || null,
            message: "Debes iniciar sesión para realizar una reserva."
          } 
        });
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoggedIn, navigate, location.pathname, serviceId, categoryId, location.state]);

  // Effect para añadir el efecto de agua distorsionada al fondo
  useEffect(() => {
      // Crear estilo para el efecto de agua
      const styleId = "water-effect-style-reserva";
      if (!document.getElementById(styleId)) {
          const styleTag = document.createElement("style");
          styleTag.id = styleId;
          styleTag.innerHTML = `
              .reserva-container {
                  position: relative;
                  min-height: 100vh;
                  overflow: hidden;
              }

              #svg-reserva {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100vw;
                  height: 100vh;
                  z-index: -2;
                  pointer-events: none;
              }

              #distorted-image-reserva {
                  filter: url("#disFilterReserva");
              }

              .reserva-form-container {
                  
                  border-radius: 10px;
                  padding: 40px;
                  
                  max-width: 550px;
                  margin: 0 auto;
                  
              }

              .reserva-title {
                  text-align: center;
                  margin-bottom: 20px;
                  color: #fff;
                  text-shadow: 1px 1px 2px rgb(0, 141, 129);
              }

              .login-message {
                  background-color: rgba(248, 215, 218, 0.9);
                  color: #721c24;
                  padding: 1rem;
                  border-radius: 5px;
                  margin-bottom: 1rem;
                  text-align: center;
                  backdrop-filter: blur(5px);
              }

              .back-button {
                  margin-top: 15px;
                  background-color: #6c757d;
                  border: none;
                  color: white;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  display: block;
                  margin: 20px auto 0;
                  transition: background-color 0.3s;
              }

              .back-button:hover {
                  background-color: #5a6268;
              }
          `;
          document.head.appendChild(styleTag);
      }

      // Animación para el filtro de turbulencia
      let turbulence;
      let frameId;
      let base = 0.004;
      let direction = 0.3;

      // Esperar a que el SVG esté en el DOM
      setTimeout(() => {
          turbulence = document.querySelector('#disFilterReserva feTurbulence');
          
          const animate = () => {
              if (!turbulence) return;

              base += direction * 0.00001;
              if (base >= 0.01 || base <= 0.004) direction *= -1;

              turbulence.setAttribute('baseFrequency', base.toString());
              frameId = requestAnimationFrame(animate);
          };

          frameId = requestAnimationFrame(animate);
      }, 100);

      return () => {
          if (frameId) {
              cancelAnimationFrame(frameId);
          }
      };
  }, []);

  // Obtener información del servicio desde la URL o desde location state
  useEffect(() => {
    if (location.state?.service) {
      setServiceInfo(location.state.service);
    } else if (categoryId && serviceId) {
      const categoryServices = serviceDetails[categoryId] || [];
      const service = categoryServices.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === serviceId);
      if (service) {
        setServiceInfo(service);
      }
    }
  }, [location, categoryId, serviceId]);

  // Si el usuario no está logueado o estamos en proceso de redirección, mostramos mensaje
  if (!isLoggedIn) {
    return (
      <div className="reserva-container">
        {/* SVG para el efecto de agua */}
        <svg id="svg-reserva">
          <defs>
            <filter id="disFilterReserva">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.005"
                numOctaves="3"
                seed="2"
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
            id="distorted-image-reserva"
            xlinkHref="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=f19a8fc678bb87aedd5f5959022bbf71"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            preserveAspectRatio="none"
          />
        </svg>

        <div className="container py-5" style={{ paddingTop: "80px" }}>
          <div className="reserva-form-container">
            <div className="login-message">
              Redirigiendo al inicio de sesión...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepara datos adicionales del usuario si está logueado
  const moreData = userData ? {
    userId: userData.id,
    userEmail: userData.email,
    userPhone: userData.telefono,
    userName: userData.nombre || userData.name,
    serviceId: serviceInfo?.title || "",
    servicePrice: serviceInfo?.price || ""
  } : null;

  // Configuración para guardar en localStorage
  const setDataConfig = {
    save: true,
    key: "reservations"
  };

  const context = {
    title: serviceInfo ? `${serviceInfo.title}` : "Reserva de Servicio",
    service: "reservationForm",
    style: {
      padding: "2rem",
      borderRadius: "10px",
    },
    className: "col-12",
    messages: {
      success: { 
        show: true, 
        text: "¡Reserva realizada correctamente!"
      },
      error: { show: true, text: "Error al enviar el formulario de reserva." },
    },
    inputs: [
      {
        tag: "input",
        type: "text",
        id: "name",
        name: "name",
        placeholder: "Nombre",
        required: true,
        value: userData?.nombre || userData?.name || "",
      },
      {
        tag: "input",
        type: "email",
        id: "email",
        name: "email",
        placeholder: "Email",
        required: true,
        value: userData?.email || "",
      },
      {
        tag: 'input',
        type: 'tel',
        id: 'telefono',
        name: 'telefono',
        placeholder: 'Número de teléfono',
        required: true,
        value: userData?.telefono || "",
      },
      {
        tag: "input",
        type: "date",
        id: "fecha",
        name: "fecha",
        placeholder: "Fecha preferida",
        required: true,
      },
      {
        tag: "input",
        type: "time",
        id: "hora",
        name: "hora",
        placeholder: "Hora preferida",
        required: true,
      },
      {
        tag: "textarea",
        id: "comments",
        name: "comments",
        placeholder: "Notas adicionales o preferencias",
        required: false,
      },
    ],
    moreData: moreData,
    setData: setDataConfig,
    redirectPath: "/", // Redirección a home después de reservar
  };

  return (
    <div className="reserva-container">
      {/* SVG para el efecto de agua */}
      <svg id="svg-reserva">
        <defs>
          <filter id="disFilterReserva">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.005"
              numOctaves="3"
              seed="2"
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
          id="distorted-image-reserva"
          xlinkHref="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=f19a8fc678bb87aedd5f5959022bbf71"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          preserveAspectRatio="none"
        />
      </svg>

      <div className="container py-5" style={{ paddingTop: "80px" }}>
        <div className="reserva-form-container">
          
          
          <Form context={context} />
          
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reserva;
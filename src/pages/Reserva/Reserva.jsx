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
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [serviceInfo, setServiceInfo] = useState(null);

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
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    max-width: 800px;
                    margin: 0 auto;
                    backdrop-filter: blur(10px);
                }

                .reserva-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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
        let base = 0.005;
        let direction = 1;

        // Esperar a que el SVG esté en el DOM
        setTimeout(() => {
            turbulence = document.querySelector('#disFilterReserva feTurbulence');
            
            const animate = () => {
                if (!turbulence) return;

                base += direction * 0.00002;
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

    // Prepara datos adicionales del usuario si está logueado
    const moreData = userData ? {
      userId: userData.id,
      userEmail: userData.email,
      userPhone: userData.telefono,
      userName: userData.nombre || userData.name,
      serviceId: serviceInfo?.title || "",
      servicePrice: serviceInfo?.price || ""
    } : null;

    // Configuración para guardar en localStorage solo si está logueado
    const setDataConfig = isLoggedIn ? {
      save: true,
      key: "reservations"
    } : {
      save: false
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
          show: false, // Ya no se necesita el mensaje de éxito
          text: isLoggedIn 
            ? "¡Reserva realizada correctamente!" 
            : "No se pudo procesar tu reserva. Por favor inicia sesión."
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
          disabled: !isLoggedIn
        },
        {
          tag: "input",
          type: "email",
          id: "email",
          name: "email",
          placeholder: "Email",
          required: true,
          value: userData?.email || "",
          disabled: !isLoggedIn
        },
        {
          tag: 'input',
          type: 'tel',
          id: 'telefono',
          name: 'telefono',
          placeholder: 'Número de teléfono',
          required: true,
          value: userData?.telefono || "",
          disabled: !isLoggedIn
        },
        {
          tag: "input",
          type: "date",
          id: "fecha",
          name: "fecha",
          placeholder: "Fecha preferida",
          required: true,
          disabled: !isLoggedIn
        },
        {
          tag: "input",
          type: "time",
          id: "hora",
          name: "hora",
          placeholder: "Hora preferida",
          required: true,
          disabled: !isLoggedIn
        },
        {
          tag: "textarea",
          id: "comments",
          name: "comments",
          placeholder: "Notas adicionales o preferencias",
          required: false,
          disabled: !isLoggedIn
        },
      ],
      moreData: moreData,
      setData: setDataConfig,
      redirectPath: "/", // No hay redirección a "reserva-confirmada"
      submitDisabled: !isLoggedIn,
      onSubmitAttempt: () => {
        if (!isLoggedIn) {
          setShowLoginMessage(true);
        }
      }
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
            xlinkHref="https://github.com/SebastianPanozzo/spa-proyecto/blob/master/Metodolog-a-de-Sistemas-1/public/imagenes/fondo_Register_login.jpeg?raw=true"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            preserveAspectRatio="none"
          />
        </svg>

        <div className="container py-5" style={{ paddingTop: "80px" }}>
          <div className="reserva-form-container">
            {showLoginMessage && !isLoggedIn && (
              <div className="login-message">
                Debes iniciar sesión para realizar una reserva.
              </div>
            )}
            
            {serviceInfo && (
              <h3 className="reserva-title">Reserva: {serviceInfo.title}</h3>
            )}
            
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

import React, { useEffect, useState } from "react";
import Form from "../../../components/form";
import { useUserData } from "../../../hooks/hook";

function Contacts() {
  const { userData, isLoggedIn } = useUserData();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgFilter.style.position = "absolute";
    svgFilter.style.width = "0";
    svgFilter.style.height = "0";
    svgFilter.innerHTML = `
      <filter id="underwaterNoise">
        <feTurbulence type="turbulence" baseFrequency=".05" numOctaves="1" seed="3" stitchTiles="stitch" />
        <feDisplacementMap in="SourceGraphic" scale="8" />
      </filter>
    `;
    document.body.appendChild(svgFilter);

    return () => {
      document.body.removeChild(svgFilter);
    };
  }, []);

  // Prepara datos adicionales del usuario si está logueado
  const moreData = userData ? {
    userId: userData.id,
    userEmail: userData.email,
    userPhone: userData.telefono,
    userName: userData.nombre || userData.name // Usamos cualquiera que esté disponible
  } : null;

  // Configuración para guardar en localStorage solo si está logueado
  const setDataConfig = isLoggedIn ? {
    save: true,
    key: "contactSubmissions"
  } : {
    save: false // No guarda en localStorage si el usuario no está logueado
  };

  const context = {
    title: "Contacto",
    service: "contactForm",
    style: {
      backgroundColor: "rgba(40, 120, 100, 0.6)", // Aumentada la opacidad para mayor visibilidad
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Sombra más pronunciada
      color: "#fff", // Texto blanco para mejor contraste
    },
    className: "col-md-6 col-lg-4",
    messages: {
      success: { 
        show: true, 
        text: isLoggedIn 
          ? "Gracias por contactarte con nosotros." 
          : "Tu mensaje no puede ser procesado. Por favor inicia sesión."
      },
      error: { show: true, text: "Error al enviar el formulario." },
    },
    inputs: [
      {
        tag: "input",
        type: "text",
        id: "name",
        name: "name",
        placeholder: "Nombre",
        required: true,
        value: userData?.nombre || userData?.name || "", // Pre-llenar si hay datos
        disabled: !isLoggedIn // Deshabilitar si no está logueado
      },
      {
        tag: "input",
        type: "email",
        id: "email",
        name: "email",
        placeholder: "Email",
        required: true,
        value: userData?.email || "", // Pre-llenar si hay datos
        disabled: !isLoggedIn // Deshabilitar si no está logueado
      },
      {
        tag: 'input',
        type: 'tel',
        id: 'telefono',
        name: 'telefono',
        placeholder: 'Número de teléfono',
        required: true,
        value: userData?.telefono || "", // Pre-llenar si hay datos
        disabled: !isLoggedIn // Deshabilitar si no está logueado
      },
      {
        tag: "textarea",
        id: "message",
        name: "message",
        placeholder: "Mensaje",
        required: true,
        disabled: !isLoggedIn // Deshabilitar si no está logueado
      },
    ],
    moreData: moreData,
    setData: setDataConfig, // Aplicamos la configuración condicional
    redirectPath: null, // No redirigir después del envío
    // Deshabilitar envío si no está logueado
    submitDisabled: !isLoggedIn,
    onSubmitAttempt: () => {
      if (!isLoggedIn) {
        setShowLoginMessage(true);
      }
    }
  };

  const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
    },
    formContainer: {
      position: "relative",
      zIndex: 10,
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      // Fondo verde más pronunciado y menos transparente
      background: "linear-gradient(to top, rgba(20, 100, 70, 0.85), rgba(10, 70, 50, 0.9))", // Gradiente ajustado
      opacity: 0.85, // Aumentada la opacidad
      mixBlendMode: "normal", // Cambiado de "overlay" a "normal" para mayor claridad
    },
    surface: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      mixBlendMode: "soft-light", // Cambiado para reducir el brillo
    },
    surfaceBefore: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTIwOTZ8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat-x",
      backgroundSize: "100% 30vh",
      transform: "scale3d(1, -1, 1)",
      animation: "surfaceAnimation 8s linear infinite",
      opacity: 0.3, // Aumentada la opacidad
      maskImage: "linear-gradient(to top, white, transparent 30vh)",
    },
    surfaceAfter: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTIwOTZ8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat-x",
      backgroundSize: "100% 30vh",
      transform: "scale3d(-1, -1, 1)",
      animation: "surfaceAnimation 8s linear infinite",
      animationDelay: "-4s",
      opacity: 0.3, // Aumentada la opacidad
      maskImage: "linear-gradient(to top, white, transparent 30vh)",
    },
    caustics: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      filter: "url(#underwaterNoise)",
    },
    causticsBefore: {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTAwNjh8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat",
      backgroundSize: "100vw 30vh",
      animation: "causticsAnimation 10s linear infinite",
      opacity: 0.2, // Aumentada la opacidad
      maskImage: "linear-gradient(to top, white, transparent, transparent, transparent)",
    },
    causticsAfter: {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTAwNjh8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat",
      backgroundSize: "100vw 30vh",
      animation: "causticsAnimation 11s linear infinite",
      animationDelay: "-2s",
      transform: "scale3d(-1, 1, 1)",
      opacity: 0.2, // Aumentada la opacidad
      maskImage: "linear-gradient(to top, white, transparent, transparent, transparent)",
    },
    sun: {
      position: "absolute",
      mixBlendMode: "soft-light", // Cambiado para reducir el brillo
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      opacity: 0.6, // Aumentada la opacidad general
    },
    sunLayer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transformOrigin: "50vw 0",
      animation: "sunAnimation 7s ease infinite alternate",
      maskImage:
        "linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 55%, transparent 80%)",
      opacity: 0.1, // Aumentada la opacidad
    },
    sunLayer1: {
      background:
        "linear-gradient(to right, transparent 39%, #7bc8a4 40%, transparent 41%, transparent 48.5%, #7bc8a4 50%, transparent 51.5%, transparent 53%, #7bc8a4 54%, transparent 55%, transparent 70%, #7bc8a4 71%, transparent 72%)",
    },
    sunLayer2: {
      animation: "sunAnimation 7.8s ease infinite alternate-reverse",
      animationDelay: "-2s",
      background:
        "linear-gradient(to right, transparent 32%, #7bc8a4 33%, transparent 34%, transparent 38%, #7bc8a4 39%, transparent 40%, transparent 53%, #7bc8a4 54%, transparent 55%, transparent 63.5%, #7bc8a4 65%, transparent 66.5%)",
    },
    sunLayer3: {
      animation: "sunAnimation 8.5s ease infinite alternate",
      animationDelay: "-5s",
      background:
        "linear-gradient(to right, transparent 38.5%, #7bc8a4 40%, transparent 41.5%, transparent 47%, #7bc8a4 48%, transparent 49%, transparent 52%, #7bc8a4 53%, transparent 54%, transparent 60%, #7bc8a4 61%, transparent 62%)",
    },
    loginMessage: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#333",
      padding: "1rem",
      borderRadius: "5px",
      marginBottom: "1rem",
      textAlign: "center",
      fontWeight: "bold"
    }
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes surfaceAnimation {
        0% { opacity: 0; background-position: center bottom; background-size: 100% 70vh; }
        20% { opacity: 0.25; }
        100% { opacity: 0; background-position: center bottom -30vh; background-size: 100% 30vh; }
      }
      @keyframes causticsAnimation {
        0% { background-position: bottom 0px left; }
        100% { background-position: bottom 0px left -100vw; }
      }
      @keyframes sunAnimation {
        0% { opacity: 0.1; transform: skew(5deg) scale3d(3, 1.5, 1); }
        50% { opacity: 0.08; transform: skew(0deg) scale3d(1.5, 1, 1); }
        100% { opacity: 0.1; transform: skew(-5deg) scale3d(3, 1, 1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.surface}>
        <div style={styles.surfaceBefore}></div>
        <div style={styles.surfaceAfter}></div>
      </div>
      <div style={styles.caustics}>
        <div style={styles.causticsBefore}></div>
        <div style={styles.causticsAfter}></div>
      </div>
      <div style={styles.sun}>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer1 }}></div>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer2 }}></div>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer3 }}></div>
      </div>
      <div className="row min-vh-100 py-4" style={styles.formContainer}>
        <div className="col-12 d-flex flex-column align-items-center justify-content-center">
          {showLoginMessage || !isLoggedIn ? (
            <div style={styles.loginMessage}>
              {isLoggedIn ? 
                "Ahora puedes enviar tu mensaje de contacto." : 
                "Debes iniciar sesión para enviar un mensaje de contacto."}
            </div>
          ) : null}
          <Form context={context} />
        </div>
      </div>
    </div>
  );
}

export default Contacts;
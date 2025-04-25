import Form from "@/components/form";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Register() {
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

  const registerContext = {
    title: "Crear una cuenta",
    inputs: [
      {
        tag: 'input',
        type: 'text',
        id: 'nombre',
        name: 'nombre',
        placeholder: 'Nombre completo',
        required: true
      },
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
        type: 'tel',
        id: 'telefono',
        name: 'telefono',
        placeholder: 'Número de teléfono',
        required: true
      },
      {
        tag: 'input',
        type: 'password',
        id: 'password',
        name: 'password',
        placeholder: 'Contraseña',
        required: true
      },
      {
        tag: 'input',
        type: 'password',
        id: 'confirmPassword',
        name: 'confirmPassword',
        placeholder: 'Confirmar contraseña',
        required: true
      }
    ],
    service: 'registerForm',
    style: { maxWidth: '450px', margin: '0 auto' },
    className: 'shadow p-4',
    messages: {
      success: {
        show: true,
        text: "¡Registro exitoso! Ahora puedes iniciar sesión."
      },
      error: {
        show: true,
        text: "Error al registrarse. Por favor, inténtelo nuevamente."
      }
    },
    setData: {
      save: true,
      key: 'userData'
    },
    redirectPath: '/' // Redirigir al inicio después del registro
  };

  return (
    <div className="page-container">
      <svg id="svg">
        <defs>
          <filter id="disFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
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
            <div className="text-center mb-4" style={{ color: "white" }}>
              <h2 className="fw-bold" style={{ textShadow: '1px 1px 2px black' }}>Únete a Sentirse Bien Spa</h2>
              <p className="text-light" style={{ textShadow: '1px 1px 2px black' }}>
                Regístrate para acceder a reservas y ofertas exclusivas
              </p>
            </div>

            <div className="form-container">
              <Form context={registerContext} />
            </div>

            <div className="text-center mt-3" style={{ color: "white" }}>
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" style={{ color: "pink" }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
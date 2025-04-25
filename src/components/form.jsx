import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form({ context }) {
  const {
    title,
    inputs,
    service,
    style,
    className,
    messages,
    setData = { save: false, key: "userData" },
    redirectPath,
    moreData,
    customLoginLogic // Nueva propiedad para manejar lógica personalizada en login
  } = context;

  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState("Enviar");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonState("Enviando...");

    const formData = new FormData(e.target);
    const body = {};
    inputs.forEach((input) => {
      if (input.value !== undefined && formData.get(input.name) === "") {
        // Si hay un valor predefinido y el campo está vacío, usamos el valor predefinido
        body[input.name] = input.value;
      } else {
        body[input.name] = formData.get(input.name);
      }
    });

    // Añadir datos adicionales si existen
    if (moreData) {
      Object.assign(body, moreData);
    }

    try {
      let mockResponse;

      // Si es un formulario de login y hay lógica personalizada
      if (service === 'loginForm' && customLoginLogic) {
        mockResponse = await customLoginLogic(body);
      } else {
        // Simulación de una respuesta exitosa para otros formularios
        mockResponse = { 
          ...body, 
          id: moreData?.userId || `user_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
      }

      setButtonState("Enviado");
      setStatus({ type: "success" });
      setResponseData(mockResponse);

      // Guardar datos en localStorage si setData.save es true
      if (setData && setData.save) {
        const key = setData.key || "userData";
        
        if (key === "userData") {
          // Para datos de usuario, reemplazamos toda la información
          localStorage.setItem(key, JSON.stringify(mockResponse));
          // Disparar evento para actualizar otros componentes
          window.dispatchEvent(new Event('storage'));
        } 
        else if (key === "contactSubmissions") {
          // Para formularios de contacto, guardamos en un arreglo separado
          // y preservamos la información de usuario
          try {
            const existingSubmissions = localStorage.getItem(key);
            let submissions = [];
            
            if (existingSubmissions) {
              submissions = JSON.parse(existingSubmissions);
            }
            
            submissions.push(mockResponse);
            localStorage.setItem(key, JSON.stringify(submissions));
          } catch (error) {
            console.error("Error guardando datos de contacto:", error);
            localStorage.setItem(key, JSON.stringify([mockResponse]));
          }
        }
        else {
          // Para otros casos, podemos mantener datos existentes y añadir/actualizar los nuevos
          try {
            const existingData = localStorage.getItem(key);
            if (existingData) {
              const parsedData = JSON.parse(existingData);
              localStorage.setItem(key, JSON.stringify({
                ...parsedData,
                ...mockResponse
              }));
            } else {
              localStorage.setItem(key, JSON.stringify(mockResponse));
            }
          } catch (error) {
            console.error("Error guardando datos:", error);
            localStorage.setItem(key, JSON.stringify(mockResponse));
          }
        }
      }

      // Para el formulario de registro, almacenar los datos en una lista de usuarios
      if (service === 'registerForm') {
        try {
          // Obtener usuarios existentes o crear una nueva lista
          const existingUsers = localStorage.getItem('allUsers');
          let users = [];
          
          if (existingUsers) {
            users = JSON.parse(existingUsers);
          }
          
          // Agregar el nuevo usuario a la lista
          users.push(mockResponse);
          localStorage.setItem('allUsers', JSON.stringify(users));
        } catch (error) {
          console.error("Error al guardar datos de registro:", error);
          // Crear una nueva lista con este usuario
          localStorage.setItem('allUsers', JSON.stringify([mockResponse]));
        }
      }

      if (redirectPath) {
        setTimeout(() => navigate(redirectPath), 1500);
      }

      e.target.reset();
    } catch (err) {
      setButtonState("Enviar");
      setStatus({ type: "error", message: "Error de conexión" });
    }
  };

  return (
    <form
      className={`d-flex flex-column text-center rounded-2 p-3 ${className}`}
      style={{
        backgroundColor: "#e0f7fa", // celeste claro
        ...style,
      }}
      onSubmit={handleSubmit}
    >
      {title && (
        <h3
          className="mb-3"
          style={{
            color: "#fff",
            textShadow: "1px 1px 2px black",
            padding: "10px",
            border: "1px solid #f8bbd0", // borde rosado
            backgroundColor: "#f8bbd0", // mismo rosado que el botón
            borderRadius: "4px"
          }}
        >
          {title}
        </h3>
      )}

      {inputs.map((item, index) => (
        <div key={index}>
          {item.tag === "input" && (
            <input
              type={item.type}
              id={item.id}
              name={item.name}
              placeholder={item.placeholder}
              required={item.required}
              defaultValue={item.value || ""}
              className="form-control mb-2"
            />
          )}
          {item.tag === "textarea" && (
            <textarea
              name={item.name}
              id={item.id}
              placeholder={item.placeholder}
              required={item.required}
              defaultValue={item.value || ""}
              className="form-control mb-2"
              style={{ height: "100px" }}
            ></textarea>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="form-control btn"
        style={{ backgroundColor: "#f8bbd0", color: "white" }} // botón rosado
      >
        {buttonState}
      </button>

      {status.type === "success" && messages.success?.show && (
        <div className="alert alert-success mt-3">
          {messages.success.text || "Formulario enviado correctamente."}
        </div>
      )}
      {status.type === "error" && messages.error?.show && (
        <div className="alert alert-danger mt-3">
          {status.message || messages.error.text || "Hubo un error al enviar el formulario."}
        </div>
      )}
    </form>
  );
}

export default Form;
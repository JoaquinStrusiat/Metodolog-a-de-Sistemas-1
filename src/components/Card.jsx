import React from "react";

function Card({ context, onClick, showReserveButton = false }) {
  const { title, description, image, alt, button = "Ver más", price, id } = context;

  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const image = card.querySelector(".card-img-top");
    
    card.style.transform = "translateY(-8px)";
    if (image) image.style.transform = "scale(1.05)";
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    card.style.setProperty("--x", `${x / 25}px`);
    card.style.setProperty("--y", `${y / 25}px`);
    if (image) {
      image.style.setProperty("--x", `${x / -40}px`);
      image.style.setProperty("--y", `${y / -40}px`);
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const image = card.querySelector(".card-img-top");
    
    card.style.transform = "";
    if (image) image.style.transform = "";
    
    card.style.setProperty("--x", "0px");
    card.style.setProperty("--y", "0px");
    if (image) {
      image.style.setProperty("--x", "0px");
      image.style.setProperty("--y", "0px");
    }
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    alert(`¡Reserva para ${title} realizada con éxito!`);
    // Aquí podría ir la lógica para abrir un formulario de reserva
  };

  return (
    <div 
      className="card shadow-lg rounded-3 h-100" 
      style={{
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: `translate(var(--x, 0), var(--y, 0))`,
        cursor: "pointer"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ height: "200px", overflow: "hidden" }}>
        <img 
          src={image} 
          className="card-img-top" 
          alt={alt}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: `translate(var(--x, 0), var(--y, 0))`
          }}
        />
      </div>
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="card-title fw-bolder">{title}</h5>
        <p className="card-text flex-grow-1">{description}</p>
        
        {price && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-success fs-5">{price}</span>
          </div>
        )}
        
        {/* Sección de botones */}
        <div className="mt-auto">
          {/* Botón de explorar para tarjetas de tipos de servicios (con id y onClick) */}
          {onClick && id && (
            <button 
              className="btn btn-outline-success w-100"
              onClick={() => onClick(id)}
            >
              {button}
            </button>
          )}
          
          {/* Botón de reservar solo para servicios específicos */}
          {showReserveButton && (
            <button 
              className="btn btn-success"
              onClick={handleReserve}
            >
              Reservar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
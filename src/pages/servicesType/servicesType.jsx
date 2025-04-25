import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesTypes, serviceDetails } from '@/utiles/data';
import Card from "@/components/Card";

function ServiceType() {
    const { name } = useParams();
    const navigate = useNavigate();
    
    // Encontrar el tipo de servicio seleccionado
    const selectedServiceType = servicesTypes.find(type => type.id === name);
    
    // Obtener los servicios específicos para este tipo
    const services = serviceDetails[name] || [];

    // Función para manejar las reservas
    const handleReserve = (service) => {
        // Convertir título a formato URL
        const serviceId = service.title.toLowerCase().replace(/\s+/g, '-');
        // Navegar a la página de reserva con la información del servicio
        navigate(`/reserva/${name}/${serviceId}`, { 
            state: { service: service, categoryId: name }
        });
    };

    // Modificar los servicios para incluir la función de manejo de reserva
    const servicesWithReserveHandler = services.map(service => ({
        ...service,
        onReserve: () => handleReserve(service)
    }));

    return (
        <div className="py-5 bg-light"
            style={{
                backgroundImage: `url('/img/bgDark.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
                scrollMarginTop: '70px',
            }}
        >
            <div className="container">
                <div className="row text-center mb-4">
                    <h2 style={{ fontFamily: 'Lato, sans-serif', fontSize: '2.5rem', fontWeight: "800" }} className="text-white mt-3">
                        {selectedServiceType?.title || "Servicios Especializados"}
                    </h2>
                    <p className="fs-5 fw-bolder my-2 text-white">
                        Explora nuestros servicios especializados en esta categoría
                    </p>
                </div>
                
                <div className="text-center mt-5 pb-4">
                    <button 
                        className="btn btn-success btn-lg px-4 py-2"
                        onClick={() => window.location.href = '/#services'}
                    >
                        Volver a categorías
                    </button>
                </div>

                {/* Contenedor de cards con flexbox para mejor organización y centrado */}
                <div className="d-flex flex-wrap justify-content-center">
                    {servicesWithReserveHandler.map((service, index) => (
                        <div 
                            key={index} 
                            className="px-3 py-3" 
                            style={{ 
                                width: '100%', 
                                maxWidth: '350px',
                                margin: '0 auto 20px'
                            }}
                        >
                            <Card 
                                context={service} 
                                onReserveClick={service.onReserve}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ServiceType;
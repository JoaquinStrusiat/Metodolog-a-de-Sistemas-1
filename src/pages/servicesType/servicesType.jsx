import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesTypes, serviceDetails } from '@/utiles/data';
import Card from "@/components/Card";

function ServiceType() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    const selectedServiceType = servicesTypes.find(type => type.id === name);
    const services = serviceDetails[name] || [];

    const handleReserve = (service) => {
        const serviceId = service.title.toLowerCase().replace(/\s+/g, '-');
        navigate(`/reserva/${name}/${serviceId}`, {
            state: { service: service, categoryId: name }
        });
    };

    const servicesWithHandlers = services.map(service => ({
        ...service,
        onReserve: () => handleReserve(service),
        onDetails: () => setServicioSeleccionado(service),
    }));

    const pinkTextStyle = { color: "#ff528c" };
    const lightBlueStyle = { color: "#ff528c" };
    const pastelPinkButtonStyle = { backgroundColor: "#ff528c", border: "none" };

    return (
        <div
            className="py-5 bg-light"
            style={{
                backgroundImage: `url('/img/BgServices.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div className="container">
                <div className="row text-center mb-4">
                    <h2
                        style={{
                            fontFamily: 'Lato, sans-serif',
                            fontSize: '2.5rem',
                            fontWeight: "800",
                            color: "#ff528c"
                        }}
                        className="mt-3"
                    >
                        {selectedServiceType?.title || "Servicios Especializados"}
                    </h2>
                    <p 
                        className="fs-5 fw-bolder my-2"
                        style={{ color: "#ff528c" }}
                    >
                        Explora nuestros servicios especializados en esta categoría
                    </p>
                </div>

                <div className="text-center mt-5 pb-4">
                    <button
                        className="btn btn-success btn-lg px-4 py-2"
                        onClick={() => window.location.href = '/#services'}
                    >
                        Volver al inicio
                    </button>
                </div>

                <div className="d-flex flex-wrap justify-content-center">
                    {servicesWithHandlers.map((service, index) => (
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
                                onDetailsClick={service.onDetails}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {servicioSeleccionado && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={pinkTextStyle}>{servicioSeleccionado.title}</h5>
                                <button type="button" className="btn-close" onClick={() => setServicioSeleccionado(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={servicioSeleccionado.image}
                                            alt={servicioSeleccionado.title}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h4 style={pinkTextStyle}>{servicioSeleccionado.title}</h4>
                                        <p className="text-muted">Categoría: {name}</p>
                                        <p style={pinkTextStyle}>{servicioSeleccionado.description}</p>
                                        <h5 style={lightBlueStyle}>${servicioSeleccionado.price}</h5>
                                        <p><strong>Duración:</strong> {servicioSeleccionado.duracion || '60 minutos'}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h5 style={pinkTextStyle}>Descripción detallada</h5>
                                    <p>{servicioSeleccionado.descripcionDetallada || servicioSeleccionado.description}</p>

                                    <h5 style={pinkTextStyle}>Beneficios</h5>
                                    <ul>
                                        {servicioSeleccionado.beneficios ?
                                            servicioSeleccionado.beneficios.map((b, idx) => (
                                                <li key={idx} style={pinkTextStyle}>{b}</li>
                                            )) :
                                            <li style={pinkTextStyle}>Mejora tu bienestar general</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setServicioSeleccionado(null)}>
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={pastelPinkButtonStyle}
                                    onClick={() => {
                                        setServicioSeleccionado(null);
                                        handleReserve(servicioSeleccionado);
                                    }}
                                >
                                    Reservar ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceType;

import React, { useState, useRef } from 'react';
import { servicesTypes, serviceDetails } from "../../../utiles/data"; 
import Slider from "../../../components/Slider"; 
import Card from "../../../components/Card"; 
 
function Services() {
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const serviceDetailsRef = useRef(null);

    const handleViewMore = (serviceTypeId) => {
        setSelectedServiceType(serviceTypeId);
        // Scroll to service details section with smooth behavior
        if (serviceDetailsRef.current) {
            setTimeout(() => {
                serviceDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return ( 
        <>
            <div className="bg-light" id="services"  
                style={{ 
                    backgroundImage: `url('/img/bgServices.webp')`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    backgroundRepeat: "no-repeat", 
                    backgroundAttachment: "fixed", 
                    scrollMarginTop: '70px', 
                }} 
            > 
                <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center"> 
                    <div className="row text-center mb-4"> 
                        <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">Nuestros Servicios</h1> 
                        <p className="fs-5 fw-bolder my-2">Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.</p> 
                    </div> 
                    <div className="row col-12"> 
                        <Slider context={{
                            Component: Card, 
                            items: servicesTypes,
                            onItemClick: handleViewMore
                        }}/> 
                    </div> 
                </div> 
            </div>

            {selectedServiceType && (
                <div className="py-5 bg-light" ref={serviceDetailsRef}
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
                                {servicesTypes.find(type => type.id === selectedServiceType)?.title}
                            </h2>
                            <p className="fs-5 fw-bolder my-2 text-white">
                                Explora nuestros servicios especializados en esta categoría
                            </p>
                        </div>
                        
                        <div className="text-center mt-5 pb-4">
                            <button 
                                className="btn btn-success btn-lg px-4 py-2"
                                onClick={() => {
                                    const servicesSection = document.getElementById('services');
                                    servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    setSelectedServiceType(null);
                                }}
                            >
                                Volver a categorías
                            </button>
                        </div>

                        {/* Contenedor de cards con flexbox para mejor organización y centrado */}
                        <div className="d-flex flex-wrap justify-content-center">
                            {serviceDetails[selectedServiceType]?.map((service, index) => (
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
                                        showReserveButton={true} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
 
export default Services;
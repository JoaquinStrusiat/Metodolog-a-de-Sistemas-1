import React from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesTypes } from "../../../utiles/data"; 
import Slider from "../../../components/Slider"; 
import Card from "../../../components/Card"; 
 
function Services() {
    const navigate = useNavigate();

    const handleViewMore = (serviceTypeId) => {
        navigate(`/serviceType/${serviceTypeId}`);
    };

    const serviceTypesWithButtons = servicesTypes.map(serviceType => {
        return {
            ...serviceType,
            button: {
                name: serviceType.button || "Explorar",
                path: `/serviceType/${serviceType.id}`
            }
        };
    });

    // Estilo con borde para texto blanco
    const textStyleWithStroke = {
        color: "white",
        textShadow: `
            0.5px 0.5px 0 black,
            -0.5px -0.5px 0 black,
            0.5px -0.5px 0 black,
            -0.5px 0.5px 0 black
        `
    };

    return ( 
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
                    <h1 
                        style={{ 
                            ...textStyleWithStroke,
                            fontFamily: 'Lato, sans-serif',
                            fontSize: '3.5rem',
                            fontWeight: "1000"
                        }}
                        className="mt-3"
                    >
                        Nuestros Servicios
                    </h1> 
                    <p 
                        className="fs-5 fw-bolder my-2"
                        style={textStyleWithStroke}
                    >
                        Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.
                    </p> 
                </div> 
                <div className="row col-12"> 
                    <Slider context={{
                        Component: Card, 
                        items: serviceTypesWithButtons,
                        onItemClick: handleViewMore
                    }}/> 
                </div> 
            </div> 
        </div>
    );
}
 
export default Services;
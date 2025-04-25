import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/hook";

const Header = () => {
    const navigateTo = useNavigate();
    const { userData, isLoggedIn, logout } = useUserData();

    const handleLogout = () => {
        logout();
        navigateTo('/');
    };

    const textStyle = {
        color: '#32cd32',
        fontWeight: '600'
    };

    return (
        <div className="fixed-top"
            style={{
                backgroundColor: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
            }}
        >
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <a className="navbar-brand" style={textStyle} href="#home" onClick={() => navigateTo('/#home')}>
                            <i className="bi bi-suit-spade-fill me-1 fw-bolder"></i>
                            Sentirse Bien Spa
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" style={textStyle} aria-current="page" href="#home" onClick={() => navigateTo('/#home')}>
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" style={textStyle} href="#about" onClick={() => navigateTo('/#about')}>
                                        Sobre Nosotros
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" style={textStyle} href="#services" onClick={() => navigateTo('/#services')}>
                                        Servicios
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" style={textStyle} href="#location" onClick={() => navigateTo('/#location')}>
                                        Ubicación
                                    </a>
                                </li>
                            </ul>

                            {isLoggedIn ? (
                                <div className="d-flex align-items-center">
                                    <span className="me-3" style={textStyle}>
                                        Hola, {userData?.nombre || userData?.name || "Usuario"}
                                    </span>
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: "#f8bbd0", color: "white" }}
                                        type="button"
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="btn me-2 px-5"
                                        style={{ backgroundColor: "#f06292", color: "white" }}
                                        type="button"
                                        onClick={() => navigateTo('/login')}
                                    >
                                        Ingresar
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: "#f06292", color: "white" }}
                                        type="button"
                                        onClick={() => navigateTo('/register')}
                                    >
                                        Registrarse
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;

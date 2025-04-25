//(index.jsx)
import Home from "./sections/home";
import About from "./sections/About";
import Services from "./sections/services";
import Location from "./sections/location";
import Contacts from "./sections/contacts";


function Landing() {
    return (
        <div>
            < Home />
            < About />
            < Services />
            < Location /> 
            < Contacts />
        </div>
    );
}

export default Landing;
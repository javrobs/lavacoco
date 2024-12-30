import React,{useContext,useState,useRef} from "react"
import {Link,useNavigate} from "react-router"
import Icon from "./Icon.jsx"
import {userContext} from "../components/App.jsx"
import MiniMenu from "./MiniMenu.jsx"



const Header = () => {
    
    const userInfo = useContext(userContext);

    


    return <header className="drop-shadow-xl flex z-10 relative h-24">
    <Link className='inline-flex' to='/'>
    <img src='/static/frontend/logomini.svg' className='logo p-2 max-h-24 min-w-16 sm:hidden'/>
    <img src='/static/frontend/logo.png' className='logo max-h-24 min-w-40 hidden sm:block'/>
    </Link>
    {userInfo.logged_in&&<LoggedInNav/>}
</header>
}

const NotLoggedInNav = () => {
    return <nav className='grow p-3 inline-flex items-center justify-end gap-6'>
        <Link className='ms-auto btn border-4 p-2 rounded-full login-button' to='/iniciar-sesion'>
            Ingresar
            <Icon icon="login"/>
        </Link>
    </nav>
}

function LoggedInNav(){
    const userInfo = useContext(userContext);
    const navigate = useNavigate();

    function logUserOut(){
        console.log("logging user out");
        fetch('/api/logout_user')
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            if(data.success){
                console.log("Logout exitoso");
                navigate("/");
                userInfo.refreshFunction();
            } else {
                console.log("Logout falló");
            }
        })
    }

    console.log("redo the header")

    return <nav className='relative grow p-3 inline-flex items-center justify-end gap-6'>
        <Link to='/cliente-frecuente'>Cliente Frecuente</Link>
        <Link>Mis órdenes</Link>
        <MiniMenu>
            <Link to='/cliente-frecuente'>Cliente Frecuente</Link>
            <Link to='/cliente-frecuente'>Mis órdenes</Link>
            <button onClick={logUserOut}>Cerrar sesión</button>
        </MiniMenu>
    </nav>
}

export default Header;
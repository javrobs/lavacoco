import React,{useState,useContext} from "react"
import Icon from "./Icon.jsx"
import { useNavigate, NavLink} from "react-router";
import { userContext } from "./App.jsx";

const MiniMenu = () => {
    const user = useContext(userContext);
    const navigate = useNavigate();
    const [menuShowing,setMenuShowing] = useState(false);

    const NotLoggedInNav = [
        {to:'/nosotros',text:'¿Quiénes somos?',icon:'local_laundry_service'},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'}
    ]

    const LoggedInNav = [
        {to:'/nosotros',text:'¿Quiénes somos?',icon:'local_laundry_service'},
        // {to:'/cliente-frecuente',text:'Cliente frecuente',icon:'award_star'},
        // {to:'/mis-ordenes',text:'Mis órdenes',icon:'receipt_long'},
        // {to:'/invitar',text:'Invitar a un amigo',icon:'group_add'},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'}
    ]
    
    const AdminNav = [
        {to:'/crear-orden',text:'Crear órden',icon:'receipt_long'},
        {to:'/crear-cliente',text:'Nuevo cliente',icon:'person_add'},
        {to:'/entradas',text:'Entradas',icon:'input'},
        {to:'/salidas',text:'Salidas',icon:'output'},
        {to:'/tintoreria',text:'Tintorería',icon:'dry_cleaning'},
        {to:'/reportes',text:'Reportes', icon:'dashboard'},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'}
    ]

    const links = (user.logged_in?
        (user.superuser?AdminNav:LoggedInNav):
        NotLoggedInNav).map((each,i)=>{
            return <NavLink onClick={()=>setMenuShowing(false)} key={"link"+i} to={each.to}>{each.text}<Icon icon={each.icon}/></NavLink>
        })

    const style = {
        transition: ".2s",
        transform: menuShowing?"translate(-16rem,0rem)":"translate(0rem,0rem)"
    }

    function logUserIn(){
        navigate("/iniciar-sesion");
        setMenuShowing(false);
    }

    function logUserOut(){
        console.log("logging user out");
        fetch('/api/logout_user')
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            if(data.success){
                console.log("Logout exitoso");
                navigate("/");
                user.refreshFunction();
                setMenuShowing(false);
            } else {
                console.log("Logout falló");
            }
        })
    }

    return <>
    <button className='mini-menu-button ms-auto px-3 hover:bg-sky-400 hover:bg-opacity-20' onClick={()=>setMenuShowing(true)}>
        <Icon classNameExtra='text-3xl' icon="menu"/>
    </button>
    <div style={style} className="absolute w-64 -right-64 top-0 flex flex-col gap-2 min-h-dvh bg-slate-950 text-blue-50">
        
        <div className="mini-menu-links flex flex-col justify-start">
        <button className="text-start p-2" onClick={()=>setMenuShowing(false)}><Icon icon='close'/></button>
            {links}
        </div>
        <div className="p-2 flex justify-between items-center mt-auto">
            {user.logged_in&&<NavLink className='flex align-middle rounded-full p-2 hover:bg-sky-300 hover:bg-opacity-10'  onClick={()=>setMenuShowing(false)} to='/configuracion'><Icon icon='settings'/></NavLink>}
            <button className="ms-auto rounded-md p-2 btn bg-blue-600 hover:bg-blue-800 hover:text-white"  onClick={user.logged_in?logUserOut:logUserIn}>
                {user.logged_in?"Cerrar sesión":"Ingresar"}
                <Icon icon={user.logged_in?"logout":"login"}/>
            </button>
        </div>
    </div>
    </>
}


export default MiniMenu;
import React,{useState,useContext} from "react"
import Icon from "./Icon.jsx"
import { useNavigate, NavLink, redirect} from "react-router";
import { userContext } from "./App.jsx";

const MiniMenu = ({onlyMiniMenu}) => {
    const user = useContext(userContext);
    const navigate = useNavigate();
    const [menuShowing,setMenuShowing] = useState(false);
    const [redirect,setRedirect] = useState(false);

    const NotLoggedInNav = [
        // {to:'/nosotros',text:'¿Quiénes somos?',icon:'local_laundry_service'},
        {to:"/",text:"Inicio",icon:"home"},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'},
        {to:'/preguntas-frecuentes',text:'Preguntas frecuentes', icon:'help'},
    ]

    const LoggedInNav = [
        {to:"/",text:"Inicio",icon:"home"},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'},
        {to:'/preguntas-frecuentes',text:'Preguntas frecuentes', icon:'help'},
    ]
    
    const AdminNav = [
        {to:"/",text:"Inicio",icon:"home"},
        {to:'/crear-orden',text:'Crear orden',icon:'receipt_long',showLarge:true},
        {to:'/crear-cliente',text:'Nuevo cliente',icon:'person_add'},
        {to:'/tintoreria',text:'Tintorería',icon:'dry_cleaning',showLarge:true},
        {to:'/gastos',text:"Gastos",icon:"paid",showLarge:true},
        {to:'/listado',text:'Listado', icon:'local_laundry_service',showLarge:true},
        {to:'/corte',text:'Corte', icon:'money_bag'},
        {to:'/reportes',text:'Reportes', icon:'savings'},
        {to:'/lista-de-precios',text:'Lista de precios', icon:'payments'},
        {to:'/preguntas-frecuentes',text:'Preguntas frecuentes', icon:'help'},
        {to:'/clientes',text:'Clientes', icon:'groups'}
    ]

    const links = (user.logged_in?
        (user.superuser?AdminNav:LoggedInNav):
        NotLoggedInNav).map((each)=>{
            return <NavLink onClick={()=>setMenuShowing(false)} key={each.to} to={each.to}><Icon icon={each.icon}/>{each.text}</NavLink>
        })

    const linksLarge = (user.logged_in?
        (user.superuser?AdminNav:LoggedInNav):
        NotLoggedInNav).filter(({showLarge})=>showLarge).map((each)=>{
            return <NavLink key={each.to} to={each.to}>{each.text}</NavLink>
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
                user.refreshFunction().then(()=>setRedirect(true));
                setMenuShowing(false);
            } else {
                console.log("Logout falló");
            }
        })
    }

    if(redirect){
        navigate("/")
    }

    return <>
    {!onlyMiniMenu&&
    <div className="flex self-stretch text-nowrap items-center gap-4 md:gap-8 max-sm:!hidden">
        {linksLarge}
    </div>}
    <button className='mini-menu-button ms-auto min-h-16 w-16 self-stretch hover:bg-sky-400 hover:bg-opacity-20' onClick={()=>setMenuShowing(true)}>
        <Icon classNameExtra='text-3xl' icon="menu"/>
    </button>
    <div style={style} className="fixed z-40 w-64 -right-64 top-0 flex flex-col gap-2 h-dvh bg-slate-950 text-blue-50">
        <div className="mini-menu-links overflow-auto no-scrollbar flex flex-col justify-start">
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
    {menuShowing &&
    <div className="bg-slate-950 bg-opacity-80 fixed top-0 left-0 z-30 h-dvh w-dvw" onClick={()=>setMenuShowing(false)}></div>
    }
    </>
}


export default MiniMenu;
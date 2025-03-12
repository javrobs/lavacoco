import React, {useState, useEffect, createContext} from "react"
import { RouterProvider, createBrowserRouter, Navigate } from "react-router"
import Home from "../routes/Home.jsx"
import Login from "../routes/guest/Login.jsx"
import Signup from "../routes/Signup.jsx"
import PreguntasFrecuentes from "../routes/PreguntasFrecuentes.jsx"
import CrearOrden from "../routes/admin/CrearOrden.jsx"
import Orden from "../routes/admin/Orden.jsx"
import Layout from "./Layout.jsx"
import ErrorComponent from './ErrorComponent.jsx'
import ListaDePrecios from "../routes/ListaDePrecios.jsx"
import Configuracion from "../routes/Configuracion.jsx"
import defaultLoader from "../utils/defaultLoader.js"
import Tintoreria from "../routes/admin/Tintoreria.jsx"
import Gastos from "../routes/admin/Gastos.jsx"
import Reportes from "../routes/admin/Reportes.jsx"
import Listado from "../routes/admin/Listado.jsx"
import Clientes from "../routes/admin/Clientes.jsx"
import Corte from "../routes/admin/Corte.jsx"
import RegisterPassword from "../routes/guest/RegisterPassword.jsx"

export const userContext = createContext();

export default function App(){

    const [user,setUser] = useState(null);
    const [initialized,setInitialized] = useState(false);
    
    

    useEffect(()=>{getUserInfo()},[]);
    
   
    

    async function getUserInfo(){
        const response = await fetch("/api/load_user/");
        const data = await response.json();
        setUser(data);
        setInitialized(true);
        console.log(data,"user data changed");
    }

    const router = createBrowserRouter([ 
        {
            path:'/',
            element: <Layout/>,
            children:[
                {path:'/',element: <Home/>, loader:()=>defaultLoader('home')},
                {path:'/iniciar-sesion',element:<Login/>},
                {path:'/crear-cuenta', element:<Signup/>,loader:()=>defaultLoader('signup')},
                {path:'/crear-cuenta/:JWTCode', element:<Signup/>,loader:({params})=>defaultLoader('signup',params.JWTCode)},
                {path:"/crear-orden", element:<CrearOrden/>, loader:()=>defaultLoader('create_order')},
                {path:"/crear-orden/:userId", element:<CrearOrden/>, loader:()=>defaultLoader('create_order')},
                {path:"/crear-cliente", element:<Signup admin={true}/>,loader:()=>defaultLoader('signup')},
                {path:"/configuracion", element:<Configuracion/>,children:[
                    {index:"true",element:<Navigate to='/configuracion/mis-datos/' replace/>},
                    {path:"/configuracion/mis-datos",element:<Signup config={true}/>,loader:()=>defaultLoader('config')},
                    {path:"/configuracion/cambiar-contrasena",element:<RegisterPassword config={true}/>},
                ]},
                {path:'/corte',element:<Corte/>, loader:()=>defaultLoader("closeout")},
                    {path:'/corte/:day/:month/:year',element:<Corte/>, loader:({params})=>defaultLoader("closeout",params.day,params.month,params.year)},
                {path:"/reportes/:month/:year", element:<Reportes/>, loader:({params})=>defaultLoader("reports",params.month,params.year)},
                {path:"/reportes/", element:<Reportes/>, loader:()=>defaultLoader("reports")},
                {path:'/preguntas-frecuentes',element:<PreguntasFrecuentes/>, loader:()=>defaultLoader('faq')},
                {path:"/lista-de-precios", element:<ListaDePrecios/>, loader:()=>defaultLoader('price')},
                {path:"/orden/:orderId",element:<Orden/>,loader:({params})=>defaultLoader("order",params.orderId)},
                {path:"/tintoreria",element:<Tintoreria/>,loader:()=>defaultLoader('drycleaning')},
                {path:"/listado",element:<Listado/>,loader:()=>defaultLoader('laundry_machines')},
                {path:"/listado/:day/:month/:year",element:<Listado/>,loader:({params})=>defaultLoader('laundry_machines',params.day,params.month,params.year)},
                {path:"/clientes",element:<Clientes/>,loader:()=>defaultLoader('clients')},
                {path:"/editar-cliente/:userID",element:<Signup admin={true} config={true}/>, loader:({params})=>defaultLoader('edit_user',params.userID)},
                {path:"/invitacion-admin/:JWTinvite",element:<RegisterPassword/>,loader:({params})=>defaultLoader('signup_admin_invite',params.JWTinvite)},
                {path:"/recuperar-contrasena/:JWTinvite",element:<RegisterPassword recover={true}/>,loader:({params})=>defaultLoader('recover_pw',params.JWTinvite)},
            ],
            errorElement: <ErrorComponent/>
        }
    ])

    return <userContext.Provider value={{...user,refreshFunction:getUserInfo}}>
        
        {initialized?<RouterProvider router={router}/>:"Loading..."}
        
    </userContext.Provider>
}
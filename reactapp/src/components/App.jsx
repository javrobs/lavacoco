import React, {useState, useEffect, createContext} from "react"
import { RouterProvider, createBrowserRouter, useNavigate, useNavigation} from "react-router"
import Home from "../routes/Home.jsx"
import Login from "../routes/guest/Login.jsx"
import Signup from "../routes/Signup.jsx"
import PreguntasFrecuentes from "../routes/PreguntasFrecuentes.jsx"
import CrearOrden from "../routes/admin/CrearOrden.jsx"
import Orden from "../routes/admin/Orden.jsx"
import Configuracion from "../routes/Configuracion.jsx"
import Layout from "./Layout.jsx"
import ErrorComponent from './ErrorComponent.jsx'
import ListaDePrecios from "../routes/ListaDePrecios.jsx"
import defaultLoader from "../utils/defaultLoader.js"
import Tintoreria from "../routes/admin/TIntoreria.jsx"

export const userContext = createContext();

export default function App(){

    const [user,setUser] = useState(null);
    const [initialized,setInitialized] = useState(false);
    
    useEffect(()=>{getUserInfo()},[]);
    

    

    function getUserInfo(){
        return new Promise((resolve) => {
            // Simulate context update or fetch user data
        fetch("/api/load_user/")
        .then(response=>response.json())
        .then(data=>{
            setUser(data);
            setInitialized(true);
            console.log(data,"user data changed");
            resolve();
        });})
    }

    const router = createBrowserRouter([ 
        {
            path:'/',
            element: <Layout/>,
            children:[
                {path:'/',element: <Home/>, loader:()=>defaultLoader('home')},
                {path:'/iniciar-sesion',element:<Login/>},
                {path:'/crear-cuenta', element:<Signup/>},
                {path:"/crear-orden", element:<CrearOrden/>, loader:()=>defaultLoader('create_order')},
                {path:"/crear-orden/:userId", element:<CrearOrden/>, loader:()=>defaultLoader('create_order')},
                {path:"/crear-cliente", element:<Signup admin={true}/>},
                {path:"/configuracion", element:<Configuracion/>},
                {path:'/preguntas-frecuentes',element:<PreguntasFrecuentes/>, loader:()=>defaultLoader('faq')},
                {path:"/lista-de-precios", element:<ListaDePrecios/>, loader:()=>defaultLoader('price')},
                {path:"/orden/:orderId",element:<Orden/>,loader:({params})=>defaultLoader("order",params.orderId)},
                {path:"/tintoreria",element:<Tintoreria/>,loader:()=>defaultLoader('drycleaning')}
            ],
            errorElement: <ErrorComponent/>
        }
    ])

    return <userContext.Provider value={{...user,refreshFunction:getUserInfo}}>
        
        {initialized?<RouterProvider router={router}/>:"Loading..."}
        
    </userContext.Provider>
}
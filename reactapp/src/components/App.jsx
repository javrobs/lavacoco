import React, {useState, useEffect, createContext} from "react"
import { RouterProvider, createBrowserRouter} from "react-router"
import Home, {homeLoader} from "../routes/Home.jsx"
import Login from "../routes/Login.jsx"
import Signup from "../routes/Signup.jsx"
import Nosotros from "../routes/Nosotros.jsx"
import ClienteFrecuente from "../routes/ClienteFrecuente.jsx"
import CrearOrden from "../routes/CrearOrden.jsx"
import Configuracion from "../routes/Configuracion.jsx"
import MisOrdenes from "../routes/MisOrdenes.jsx"
import Invitar from "../routes/Invitar.jsx"
import Layout from "./Layout.jsx"
import ErrorComponent from './ErrorComponent.jsx'
import ListaDePrecios, { priceLoader } from "../routes/ListaDePrecios.jsx"

export const userContext = createContext();

export default function App(){

    const [user,setUser] = useState(null);
    const [initialized,setInitialized] = useState(false);

    useEffect(getUserInfo,[]);

    function getUserInfo(){
        fetch("/api/load_user")
        .then(response=>response.json())
        .then(data=>{
            setUser(data);
            setInitialized(true);
        });
    }

    const router = createBrowserRouter([ 
        {
            path:'/',
            element: <Layout/>,
            children:[
                {path:'/',element: <Home/>},
                {path:'/iniciar-sesion',element:<Login/>},
                {path:'/crear-cuenta', element:<Signup/>},
                // {path:"/nosotros",element:<Nosotros/>},
                // {path:"/cliente-frecuente",element:<ClienteFrecuente/>},
                // {path:"/crear-orden", element:<CrearOrden/>},
                // {path:"/mis-ordenes", element:<MisOrdenes/>},
                // {path:"/invitar", element:<Invitar/>},
                {path:"/configuracion", element:<Configuracion/>},
                {path:"/lista-de-precios", element:<ListaDePrecios/>, loader:priceLoader}
            ],
            errorElement: <ErrorComponent/>
        }
    ])

    return <userContext.Provider value={{...user,refreshFunction:getUserInfo}}>
        
        {initialized?<RouterProvider router={router}/>:"Loading..."}
        
    </userContext.Provider>
}
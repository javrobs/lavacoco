import React, {useState, useEffect, createContext} from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router"
import Home from "../routes/Home.jsx"
import Login from "../routes/Login.jsx"
import Signup from "../routes/Signup.jsx"
import Nosotros from "../routes/Nosotros.jsx"
import ClienteFrecuente from "../routes/ClienteFrecuente.jsx"

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

    return <userContext.Provider value={{...user,refreshFunction:getUserInfo}}>
        <BrowserRouter>
            {!initialized?<main>
                Loading...
            </main>:
            <main className="z-0">
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="/iniciar-sesion" element={<Login/>}/>
                    <Route path="/crear-cuenta" element={<Signup/>}/>
                    <Route path="/nosotros" element={<Nosotros/>}/>
                    <Route path="/cliente-frecuente" element={<ClienteFrecuente/>}/>
                </Routes>
            </main>}
        </BrowserRouter>
        </userContext.Provider>
}
import React,{useRef} from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router"
import Home from "../routes/Home.jsx"
import Lista from "../routes/Lista.jsx"
import Login from "../routes/Login.jsx"
import Signup from "../routes/Signup.jsx"
import Nosotros from "../routes/Nosotros.jsx"

export default function App(){
    
    return <BrowserRouter>
            <main className="z-0">
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="/servicios" element={<Lista/>}/>
                    <Route path="/iniciar-sesion" element={<Login/>}/>
                    <Route path="/crear-cuenta" element={<Signup/>}/>
                    <Route path="/nosotros" element={<Nosotros/>}/>
                </Routes>
            </main>
        </BrowserRouter>
}
import React, {useRef} from "react"
import {Link,Route} from "react-router"
import Icon from "../components/Icon.jsx"
import scrollToRef from "../utils/scrollToRef.js"
import Lista2 from "./Lista2.jsx"


export default function Home(){
    const services = useRef(null);

    return <div className="relative h-dvh no-scrollbar">
        <video autoPlay muted loop src='/static/frontend/bg-5.mp4' id="hero-vid"/>
        <header className="fixed top-0 z-20 right-0 p-2">
            <Link to="/iniciar-sesion" className="rounded-full login-button border-4 p-2 flex items-center shadow-md"><Icon icon='login'/></Link>
        </header>
        <div className="z-10 relative min-h-dvh flex items-center px-3 justify-center">
            <div className='bg-slate-800 bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center justify-center flex flex-col'>
                <img src='/static/frontend/logo.png' width="300"/>
                <h2 className='text-slate-300 text-4xl text-center font-semibold'>Diligencia, rapidez y gran cariño</h2>
                <div className="flex flex-wrap justify-center gap-3 text-lg">
                    <button className="btn cta" onClick={()=>{scrollToRef(services)}}>Servicios<Icon icon='laundry'/></button>
                </div>
            </div>
        </div>
        <div ref={services} className="z-10 relative min-h-dvh px-3 flex flex-col items-center justify-center p-2 mx-auto" id="servicios">
            <Lista2/>
        </div>
    </div>
}
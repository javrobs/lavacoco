import React, {useRef,useContext} from "react"
import {userContext} from "../components/App.jsx"
import {Link,Route} from "react-router"
import Icon from "../components/Icon.jsx"
import scrollToRef from "../utils/scrollToRef.js"
import Header from "../components/Header.jsx"


export default function Home(){
    const services = useRef(null);
    const user = useContext(userContext)


    function LoggedUser(){
        return <><Header/>
        </>
    }

    function NotLoggedUser(){

        

        return <div className="relative h-dvh no-scrollbar">
            <video autoPlay muted loop src='/static/frontend/bg-5.mp4' id="hero-vid"/>
            <header className="fixed top-0 z-20 right-0 p-2">
                {user.logged_in?
                <Link to="/cerrar-sesion" className="rounded-full login-button border-4 p-2 flex items-center shadow-md"><Icon icon='logout'/></Link>:
                <Link to="/iniciar-sesion" className="rounded-full login-button border-4 p-2 flex items-center shadow-md"><Icon icon='login'/></Link>}
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
                <Lista/>
            </div>
        </div>
    }

    return user.logged_in?<LoggedUser/>:<NotLoggedUser/>
}


const Lista = () => {

    const listaDePreciosLavanderia = [
        {concepto:"Carga lavado y secado",precio:95},
        {concepto:"Carga sólo secado",precio:60},
        {concepto:"Carga lavado y secado, mismo día",precio:115},
        
    ]

    const listaDePreciosPlancha = [
        {concepto:"Prenda",precio:20},
        {concepto:"Gancho",precio:5}
    ]

    const listaDePreciosTintoreria = [
        {concepto:"Traje dos piezas",precio:140},
        {concepto:"Saco",precio:100},
        {concepto:"Falda, blusa, pantalón", precio:50},
    ]

    const listaDePreciosSabanas = [
        {concepto:"Set de sábanas",precio:95},
        {concepto:"Cobertor",precios:[140,160,180,250]},
        {concepto:"Edredón",precios:[160,180,200,300]}
    ]

    return <div className='flex flex-wrap gap-2 max-w-2xl'>
    <ListaDePrecios title="Lavandería" elements={listaDePreciosLavanderia}/>
    <ListaDePrecios title="Planchaduría" elements={listaDePreciosPlancha}/>
    <ListaDePrecios title="Tintorería" elements={listaDePreciosTintoreria}/>
    <TablaDePrecios title="Ropa de cama" elements={listaDePreciosSabanas} cols={["Individual","Matrimonial","Queen o King","Voluminoso"]}/>
    </div>
}

function ListaDePrecios(props){
    const asList = props.elements.map((each,i)=>(
            <li className="flex" key={`lava-${i}`}>{each.concepto}<div className="ms-auto">$ {each.precio}</div></li>
        ))

    return <div className="bg-slate-800 grow bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center flex flex-col">
        <h1 className='text-orange-600'>{props.title}</h1>
        <ul className='text-slate-300 self-stretch text-lg'>
            {asList}
        </ul>
    </div>
}

function TablaDePrecios(props){
    console.log(props);

    const tabla = props.elements.map((each, i) => {
        console.log(each);
        return (each.precio)?<div className="flex text-slate-300 text-lg" key={`lava-${i}`}>
            {each.concepto}
            <div className="ms-auto">$ {each.precio}</div>
        </div>:<div key={`lava-${i}`}>
        {each.concepto}No tiene precio bb 
        </div>
    })

    return <div className="bg-slate-800 grow bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center flex flex-col">
        <h1 className='text-orange-600'>{props.title}</h1>
        <div className="self-stretch text-slate-300 text-lg">
            <div className="flex">
                    Set de sábanas
                    <span className="ms-auto">$ 95</span>
            </div>
            <div className="grid grid-cols-3">
                <div></div><div className="text-end">Cobertor</div><div className="text-end">Edredón</div>
                <div className="text-start">Individual</div><div className="text-end">$140</div><div className="text-end">$160</div>
                <div className="text-start">Matrimonial</div><div className="text-end">$160</div><div className="text-end">$180</div>
                <div className="text-start">Queen o King</div><div className="text-end">$180</div><div className="text-end">$200</div>
                <div className="text-start">Voluminoso</div><div className="text-end">$250</div><div className="text-end">$300</div>
            </div>
        </div>
        
    </div>
}


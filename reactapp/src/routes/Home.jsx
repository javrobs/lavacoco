import React, {useRef,useContext,useState,useEffect} from "react"
import {userContext} from "../components/App.jsx"
import {Link,useLoaderData, useNavigate} from "react-router"
import Icon from "../components/Icon.jsx"
import scrollToRef from "../utils/scrollToRef.js"
import MiniMenu from "../components/MiniMenu.jsx"
import FrequentCustomerPlot from "../components/FrequentCustomerPlot.jsx"


export default function Home(){
    
    // const loaderData = useLoaderData()
    const user = useContext(userContext);
    const [loaderData, setLoaderData] = useState({});

    
    // if (navigate.state == "loading"){
    //     return <div>Loadiiiing</div>
    // }

    useEffect(()=>{
        fetch("/api/home_info")
        .then(response=>response.json())
        .then(data=>{
            setLoaderData(data);
        })
    },[])

    const AdminUser = () => {
        return <main className="container mx-auto">
            <div className="bubble-div">
            <h1>Hola, SUPER {user.first_name}!</h1>
            <div className="flex gap-2 justify-center mt-3">
                <Link className="btn btn-go" to='/crear-orden'>Crear orden<Icon icon='receipt_long'/></Link>
                <Link className="btn btn-go" to='/crear-cliente'>Nuevo cliente<Icon icon='person_add'/></Link>
            </div>
            </div>
            
        </main>
    }

    const LoggedUser = () => {

        console.log(loaderData,"im a logged user, thats true")

        function copyLinkToClipboard(){
            navigator.clipboard.writeText(loaderData.user_link).then(()=>{
                console.log("texto copiado")
            },()=>{
                console.log("algo falló :(")
            })
        }

        return <main className="container grow mx-auto grid grid-cols-12 p-3 gap-3 grid-rows-2">
            <div className="col-span-12 sm:col-span-6 bubble-div-with-title">
                <div className="bubble-div-title">Cliente frecuente<Icon icon='award_star'/></div>
                <div className="p-4">
                    <h1>Hola, {user.first_name}</h1>
                    <FrequentCustomerPlot value={loaderData.cliente_freq}/>
                </div>
            </div>
            <div className="col-span-12 sm:col-span-6 sm:row-span-2 bubble-div-with-title">
                <div className="bubble-div-title">Órdenes<Icon icon='receipt_long'/></div>
                <div className="p-4">
                    
                    {loaderData.orden_activa?<div className="border-b-2 border-orange-700">
                        Órden activa
                    </div>:<div className="rounded-md bg-slate-300 text-center flex flex-col gap-1 p-3">
                        No tienes una órden activa por el momento.</div>}
                    {loaderData.ordenes_pasadas?.length>0 && <div className="border-b-2 border-orange-700">
                        Órdenes pasadas
                    </div>}
                </div>
            </div>
            <div className="col-span-12 sm:col-span-6 bubble-div-with-title">
                <div className="bubble-div-title">Invita a un amigo<Icon icon='group_add'/></div>
                <div className="p-4 flex items-stretch flex-col gap-2">
                    ¡Comparte tu enlace de lavandería coco y obtén una carga gratis con la primera visita de tu amigo!
                    <div className="rounded-md bg-slate-300 text-center flex flex-col gap-1 p-3">
                        {loaderData.user_link}
                        <button onClick={copyLinkToClipboard} className="btn btn-go mx-auto">Copiar enlace<Icon icon='content_copy'/></button>
                    </div>
                    
                </div>
            </div>
        </main>
    }

    const NotLoggedUser = () => {
        const services = useRef(null);
        const contact = useRef(null);

        return <div className="relative h-dvh no-scrollbar">
            <video autoPlay muted loop src='/static/frontend/bg-5.mp4' id="hero-vid"/>
            <header className="fixed top-0 z-20 right-0 p-2">
                <MiniMenu/>
            </header>
            <div className="z-10 relative min-h-dvh flex items-center px-3 justify-center">
                <div className='bg-slate-800 bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center justify-center flex flex-col'>
                    <img src='/static/frontend/logo.png' width="300"/>
                    <h2 className='text-slate-300 text-4xl text-center font-semibold'>Diligencia, rapidez y gran cariño</h2>
                    <div className="flex flex-wrap justify-center gap-3 text-lg">
                        <button className="btn cta" onClick={()=>{scrollToRef(services)}}>
                            Servicios<Icon icon='laundry'/>
                        </button>
                        <button className="btn cta" onClick={()=>{scrollToRef(contact)}}>
                            Contacto<Icon icon='call'/>
                        </button>
                    </div>
                </div>
            </div>
            <div ref={services} className="z-10 relative min-h-dvh px-3 flex flex-col items-center justify-center p-2 mx-auto" id="servicios">
                <div>Lista de servicios</div>
            </div>
            <div ref={contact} className="z-10 relative min-h-dvh px-3 flex flex-col items-center justify-center p-2 mx-auto" id="contacto">
                <div className="bubble-div bg-slate-800 bg-opacity-75">
                    8117328650
                </div>
            </div>
        </div>
    }

    return user.logged_in?(user.superuser?<AdminUser/>:<LoggedUser/>):<NotLoggedUser/>
}


export const homeLoader = async () => {
    console.log("im a loading loader")
    const response = await fetch("/api/home_info");
    console.log(response)
    const data = await response.json();
    console.log(data)
    return data;
}
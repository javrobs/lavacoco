import React from "react"
import {useLoaderData} from "react-router"
import FrequentCustomerPlot from "../../plots/FrequentCustomerPlot.jsx"
import Icon from "../../components/Icon.jsx"


const LoggedUser = ({user}) => {
    const loaderData = useLoaderData()

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
                
                {loaderData.cliente_freq==5?
                'Acumulaste 5 visitas ¡Tienes una carga gratis!':
                `Llevas ${loaderData.cliente_freq} visita${loaderData.cliente_freq>1?"s":""}. Junta 5 para obtener una carga gratis en tu siguiente visita.`}
                <div className="shadow-sm h-8 relative">
                <FrequentCustomerPlot value={loaderData.cliente_freq}/>
                </div>
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

export default LoggedUser;


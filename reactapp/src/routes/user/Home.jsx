import React , {useState} from "react"
import {useLoaderData, Link} from "react-router"
import FrequentCustomerPlot from "../../plots/FrequentCustomerPlot.jsx"
import Icon from "../../components/Icon.jsx"
import Paginator from "../../components/Paginator.jsx"
import MiniIconButton from "../../components/MiniIconButton.jsx"
import CopyLinkButton from "../../components/CopyLinkButton.jsx"

const LoggedUser = ({user}) => {
    const {success,...initialLoad} = useLoaderData()
    const [{ordenes_activas,user_link,page,num_pages,cliente_freq,ordenes_pasivas},reload] = useState(initialLoad);

    const ordenesActivas = ordenes_activas.map(each => <OrderCardActive key={each.id} order={each}/>)
    const ordenesPasivas = ordenes_pasivas.map(each => <OrderCard key={each.id} order={each}/>)

    return <main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 py-3 sm:px-3 gap-3">
        
        {ordenesActivas.length > 0 &&
        <div className="bubble-div-with-title sm:col-span-2 divide-y-2 divide-slate-900">
            <div className="bubble-div-title">Orden activa<Icon icon='receipt'/></div>
            {ordenesActivas}
        </div>
        }
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Cliente frecuente<Icon icon='award_star'/></div>
            <div className="p-4">
                <h1>Hola, {user.first_name}</h1>
                
                {cliente_freq==5?
                'Acumulaste 5 visitas ¡Tienes una carga gratis!':
                `Llevas ${cliente_freq} visita${cliente_freq>1?"s":""}. Junta 5 para obtener una carga gratis en tu siguiente visita.`}
                <div className="shadow-sm h-8 relative">
                <FrequentCustomerPlot value={cliente_freq}/>
                </div>
            </div>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Invita a un amigo<Icon icon='group_add'/></div>
                <div className="p-4 flex items-stretch flex-col gap-2">
                ¡Comparte tu enlace de lavandería coco y obtén una carga gratis con la primera visita de tu amigo!
                <div className="flex justify-center">
                <CopyLinkButton textToCopy={user_link}/>
                </div>
            </div>
        </div>
        {ordenesPasivas.length > 0 &&
        <div className="bubble-div-with-title sm:col-span-2">
            <div className="bubble-div-title">Órdenes pasadas<Icon icon='receipt_long'/></div>
            <Paginator
                page={page}
                num_pages={num_pages}
                resetState={reload}
                loader="home"
                className="p-4 flex flex-col gap-2"
            >
                <div className="gap-2 grid sm:grid-cols-2 lg:grid-cols-4">
                {ordenesPasivas}
                </div>
            </Paginator>
        </div>}
        
        
    </main>
}

export default LoggedUser;


const OrderCard = ({order}) => {

    return <div className="flex flex-col gap-1 items-stretch justify-between bg-white rounded-md shadow-sm p-3">
        <div className="flex items-center gap-3 col-span-2  justify-between">
            Orden #{order.id}
            <Link className="!text-black" to={`/orden/${order.id}/`}><MiniIconButton icon="visibility"/></Link>
        </div>
        <div className="flex gap-3 justify-between">
            {order.date}
            <div>$ {order.price}</div>
        </div>
    </div>
}

const OrderCardActive = ({order}) => {
    return <div className="flex gap-2 items-center shadow-md p-4">
        <div className="flex flex-col grow me-auto">
            <p className="!font-normal text-xl">Orden #{order.id}</p>
            <div>Entrega: {order.date}</div>
            <div>Estado: {order.status_string}</div>
        </div>
        {order.price>0 && <div className="text-nowrap">$ {order.price}</div>}
        <Link className="self-center shrink" to={`/orden/${order.id}/`}>
            <button className="flex items-center max-md:!rounded-full max-md:!text-base gap-1 btn-go p-3 rounded-md shadow-sm"><span className="max-md:hidden">Ver detalles</span><Icon icon="visibility"/></button>
        </Link>
    </div>
}

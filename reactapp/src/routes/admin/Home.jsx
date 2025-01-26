import React, { useState } from "react"
import { useLoaderData, Link, useNavigate } from "react-router"

import IconButton from "../../components/IconButton.jsx"
import cookieCutter from "../../utils/cookieCutter.js"
import defaultLoader from "../../utils/defaultLoader.js"
import Icon from "../../components/Icon.jsx"

const AdminUser = () => {


    const initialLoaderData = useLoaderData()
    const [loaderData,setLoaderData] = useState(initialLoaderData); 

    async function promoteOrder(id,promote){
        const response = await fetch("/api/promote_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({id:id,promote:promote})})
        const data = await response.json();
        if(data.success){
            console.log("promoted this:",id);
            const newLoaderData = await defaultLoader("home");
            setLoaderData(newLoaderData);
        } else {
            console.log("error in promoting",id);
        }
    }

    
        
    return <main className="container mx-auto py-3 grid md:grid-cols-2 gap-2">
        <div className="bubble-div-with-title md:col-span-2">
            <div className="bubble-div-title">Acceso rápido<Icon icon='select_check_box'/></div>
            <div className="flex gap-2 justify-center p-2">
                <Link className="btn btn-go" to='/crear-orden'>Crear orden<Icon icon='receipt_long'/></Link>
                <Link className="btn btn-go" to='/crear-cliente'>Nuevo cliente<Icon icon='person_add'/></Link>
            </div>
        </div>
        
        <div className="bubble-div-with-title max-h-96 overflow-y-hidden flex flex-col">
            <div className="bubble-div-title">1. Órdenes nuevas<Icon icon='clock_loader_10'/></div>
            <Orders statusValue={0} loaderData={loaderData} promoteOrder={promoteOrder}/>
        </div>
        <div className="bubble-div-with-title max-h-96 overflow-y-hidden flex flex-col">
            <div className="bubble-div-title">2. Órdenes abiertas<Icon icon='clock_loader_40'/></div>
            <Orders statusValue={1} loaderData={loaderData} promoteOrder={promoteOrder}/>
        </div>
        <div className="bubble-div-with-title max-h-96 overflow-y-hidden flex flex-col">
            <div className="bubble-div-title">3. Órdenes cerradas<Icon icon='clock_loader_60'/></div>
            <Orders statusValue={2} loaderData={loaderData} promoteOrder={promoteOrder}/>
        </div>
        <div className="bubble-div-with-title max-h-96 overflow-y-hidden flex flex-col">
            <div className="bubble-div-title">4. Órdenes listas<Icon icon='clock_loader_90'/></div>
            <Orders statusValue={3} loaderData={loaderData} promoteOrder={promoteOrder}/>
        </div>
    </main>
}


const Orders = ({statusValue, loaderData, promoteOrder}) => {
    const nav = useNavigate();

    const orders = [];
    
    let date="";
    let counter=0;
    loaderData.orders.filter(each => each.status == statusValue).forEach(each => {
        counter++
        if(date !== each.date){
            date = each.date;
            counter = 0;
            orders.push(<div className="sticky shadow-sm top-0 grid col-span-10 grid-cols-10 bg-slate-100" key={`titles-${each.id}`}>
                <div className="px-3 col-span-10 bg-slate-500 text-white">{each.date}</div>
                <div className="p-1 col-span-2 lg:col-span-1 text-center">ID</div>
                <div className="p-1 col-span-5 lg:col-span-6">Nombre</div>
                <div className="p-1 text-center col-span-3">Acciones</div>
            </div>)
        }
        const bg = counter % 2 ? "" : "bg-slate-200";
        orders.push(<div className={`p-1 col-span-2 lg:col-span-1 flex justify-center items-center ${bg}`} key={`id-${each.id}`}>{each.id}</div>);
        orders.push(<div className={`p-1 flex items-center gap-1 col-span-5 lg:col-span-6 text-nowrap overflow-hidden text-ellipsis ${bg}`} key={`name-${each.id}`}>
            {each.user}
            {each.priority&&<Icon classNameExtra="text-orange-600 bg-orange-200 rounded-full" icon="brightness_alert"/>}
            {each.pick_up_at_home&&<Icon classNameExtra="text-blue-600 bg-blue-200 rounded-full" icon="directions_car"/>}
        </div>);
        let actions;
        switch(statusValue){
            default:
                case 0:
                    actions = <IconButton onClick={()=>promoteOrder(each.id,true)} icon='arrow_right_alt'/>
                    break;
                case 1:
                    actions = <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='list'/>
                    break;
        }
        orders.push(<div className={`p-1 justify-center items-center flex gap-1 flex-wrap col-span-3 ${bg}`} key={`action-${each.id}`}>{actions}</div>)
    })
    return <div className="grid grid-cols-10 overflow-y-auto scrollbar-thin">{orders}</div>
};

export default AdminUser;
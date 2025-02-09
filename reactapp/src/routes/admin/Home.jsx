import React, { useState } from "react"
import { useLoaderData, Link, useNavigate } from "react-router"

import IconButton from "../../components/IconButton.jsx"
import cookieCutter from "../../utils/cookieCutter.js"
import defaultLoader from "../../utils/defaultLoader.js"
import Icon from "../../components/Icon.jsx"
import SubMenuButton from "../../components/SubMenuButton.jsx"
import Notify from "../../components/Notify.jsx"

const AdminUser = () => {

    const initialLoaderData = useLoaderData()
    const [loaderData,setLoaderData] = useState(initialLoaderData); 
    const [selectStatus,setSelectStatus] = useState(0);
    const [notify,setNotify] = useState({show:false});

    async function promoteOrder(id){
        const response = await fetch("/api/promote_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({id:id})})
        const data = await response.json();
        if(data.success){
            console.log("promoted this:",id);
            const newLoaderData = await defaultLoader("home");
            setLoaderData(newLoaderData);
            setSelectStatus(oldValue => oldValue + 1)
        } else {
            console.log("error in promoting",id);
        }
    }

    
        
    return <main className="container grow mx-auto py-3 flex flex-col gap-2">
        <div className="bubble-div-with-title hidden sm:block shrink-0">
            <div className="bubble-div-title">Acceso rápido<Icon icon='select_check_box'/></div>
            <div className="flex gap-2 justify-center p-2">
                <Link className="btn btn-go" to='/crear-orden'>Crear orden<Icon icon='receipt_long'/></Link>
                <Link className="btn btn-go" to='/crear-cliente'>Nuevo cliente<Icon icon='person_add'/></Link>
                <Link className="btn btn-go" to='/tintoreria'>Tintorería<Icon icon='dry_cleaning'/></Link>
            </div>
        </div>
        
        <div className="bubble-div-with-title grow flex flex-col">
            {/* <div className="bubble-div-title">Órdenes<Icon icon='receipt_long'/></div> */}
            <div className="grid gap-0.5 shrink-0 bg-slate-300 shadow-sm grid-cols-2 sm:grid-cols-4">
                {["clock_loader_10","clock_loader_40","clock_loader_60","clock_loader_90"].map((each,i)=>{
                    const names = ['Nuevas','Abiertas',"Cerradas","Listas"];
                    return <SubMenuButton 
                        classNameExtra="!py-0"
                        key = {`submenu-${i}`}
                        onClick = {() => setSelectStatus(i)}
                        activeCondition = {i == selectStatus}   
                        >
                        {names[i]} ({loaderData.orders.filter(each => each.status == i).length})
                        <Icon icon={each}/>
                    </SubMenuButton>
                })}
        </div>
            <Orders statusValue={selectStatus} setNotify={setNotify} loaderData={loaderData} promoteOrder={promoteOrder}/>
            <Notify {...notify}/>
        </div>
    </main>
}


const Orders = ({statusValue, loaderData, setNotify, promoteOrder}) => {
    const nav = useNavigate();

    const orders = [];
    
    let date = "";
    let counter = 0;
    loaderData.orders.filter(each => each.status == statusValue).forEach(each => {
        counter++
        if(date !== each.date){
            date = each.date;
            counter = 0;
            orders.push(<div className="shadow-sm top-0 px-3 col-span-10 text-white bg-blue-900" key={`titles-${each.id}`}>
                {each.date}   
            </div>)
        }
        const bg = counter % 2 ? "bg-slate-200": "bg-slate-50";
        
        orders.push(<div className={`p-1 col-span-2 lg:col-span-1 flex justify-center items-center ${bg}`} key={`id-${each.id}`}>{each.id}</div>);
        orders.push(<div className={`p-1 flex items-center gap-1 col-span-5 lg:col-span-6 text-nowrap overflow-hidden text-ellipsis ${bg}`} key={`name-${each.id}`}>
            {each.user}
            {each.priority&&<Icon classNameExtra="text-orange-600 bg-orange-200 rounded-full" icon="brightness_alert"/>}
            {each.pick_up_at_home&&<Icon classNameExtra="text-blue-600 bg-blue-200 rounded-full" icon="directions_car"/>}
        </div>);
        let actions;
        let message;
        switch(statusValue){
            case 0:
                actions = <>
                    <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='description'/>
                    <IconButton onClick={()=>promoteOrder(each.id)} icon='arrow_right_alt'/>
                </>
                break;
            case 1:
                actions = <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='list'/>
                break;
            case 2:
                const notifyThenPromote = () => {
                    setNotify({show:true,
                        number:each.phone,
                        message:`Hola ${each.user}, tu ropa está lista. Puedes ver los detalles aquí: ${location.href}order/${each.id}`,
                        backFunction: ()=>{setNotify({show:false})},
                        afterFunction: ()=>{promoteOrder(each.id);setNotify({show:false})}
                    })
                }
                actions = <>
                    <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='description'/>
                    <IconButton onClick={notifyThenPromote} icon='arrow_right_alt'/>
                </>
                break;
            case 3:
                const notify = () => {
                    setNotify({show:true,
                        number:each.phone,
                        message:`Hola ${each.user}, te recordamos que tu ropa está lista. Puedes ver los detalles aquí: ${location.href}order/${each.id}`,
                        backFunction: ()=>{setNotify({show:false})},
                    })
                }
                actions = <>
                        <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='point_of_sale'/>
                        <IconButton onClick={notify} icon='chat'/>
                    </>
                message = `Orden lista de ${each.user}, teléfono: ${each.phone}`
                break;

        }
        orders.push(<div className={`p-1 justify-center items-center flex gap-1 flex-wrap col-span-3 ${bg}`} key={`action-${each.id}`}>
            {actions}
            
            </div>);
    })
    return <div className="grid grid-cols-10 overflow-y-auto scrollbar-thin">
        {/* <div className="p-1 col-span-2 lg:col-span-1 text-center">ID</div>
        <div className="p-1 col-span-5 lg:col-span-6">Nombre</div>
        <div className="p-1 text-center col-span-3">Acciones</div> */}
        {orders}
        
    </div>
};

export default AdminUser;
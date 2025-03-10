import React, { useState } from "react"
import { useLoaderData, Link, useNavigate } from "react-router"

import IconButton from "../../components/IconButton.jsx"
import cookieCutter from "../../utils/cookieCutter.js"
import defaultLoader from "../../utils/defaultLoader.js"
import Icon from "../../components/Icon.jsx"
import SubMenuButton from "../../components/SubMenuButton.jsx"
import Notify from "../../components/Notify.jsx"
import ModalConfirm from "../../components/ModalConfirm.jsx"
import HoverInput from "../../components/HoverInput.jsx"
import lowerCaseNoAccent from "../../utils/lowerCaseNoAccent.js"
import ErrorMessage from "../../components/ErrorMessage.jsx"

const AdminUser = () => {

    const initialLoaderData = useLoaderData()
    const [loaderData,setLoaderData] = useState(initialLoaderData); 
    const [selectStatus,setSelectStatus] = useState(0);
    const [notify,setNotify] = useState({show:false});
    const [orderToDelete,setOrderToDelete] = useState({show:false});

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

    async function deleteOrder(){

        if(orderToDelete.matchInput==orderToDelete.matchValue){
            const response = await fetch("/api/delete_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(orderToDelete)})
            const data = await response.json();
            if(data.success){
                const newLoaderData = await defaultLoader("home");
                setLoaderData(newLoaderData)
                setOrderToDelete({show:false});
            }
        } else {
            setOrderToDelete(oldValue=>({...oldValue,error:"El texto no concuerda, revisa espacios, acentos y minúsculas"}))
        }
    }
    
        
    return <main className="container grow mx-auto py-3 flex flex-col gap-2">
        <div className="bubble-div-with-title grow flex flex-col">
            <div className="bubble-div-title">
                Órdenes
                <Icon icon='receipt' />
            </div>
            <div className="grid gap-0.5 shrink-0 bg-slate-300 shadow-sm grid-cols-2 sm:grid-cols-4">
                {["clock_loader_10","clock_loader_40","clock_loader_60","clock_loader_90"].map((each,i)=>{
                    const names = ['Nuevas','En proceso',"Confirmadas","Listas"];
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
            <Orders statusValue={selectStatus} setNotify={setNotify} loaderData={loaderData} setOrderToDelete={setOrderToDelete} promoteOrder={promoteOrder}/>
            <Notify {...notify}/>
            <ModalConfirm show={orderToDelete.show}>
                <h1 className="self-center text-orange-700">Confirmar</h1>
                <div className="mx-3 self-center">{orderToDelete.text}</div>
                <ErrorMessage errorContent={orderToDelete.error}/>
                <HoverInput label={`Escribe "${orderToDelete.matchValue}"`}>
                    <input type="text" name="matchInput" value={orderToDelete.matchInput||""} onChange={(e)=>setOrderToDelete(oldValue=>({...oldValue,[e.target.name]:e.target.value}))}/>
                </HoverInput>	
                <div className="flex justify-center flex-wrap gap-3">
                    <button className="flex items-center gap-1 btn-back text-nowrap justify-center grow" type="button" onClick={()=>{setOrderToDelete({show:false})}}>Regresar<Icon icon="undo"/></button>
                    <button className="btn-go justify-center text-nowrap grow flex items-center gap-1" onClick={deleteOrder} type="button">Continuar<Icon icon="check_circle"/></button>
                </div>
            </ModalConfirm>
        </div>
    </main>
}


const Orders = ({statusValue, loaderData, setNotify, promoteOrder, setOrderToDelete}) => {
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
        let mainOption,options;
        const deleteThisOrder = () => {
            const matchText = lowerCaseNoAccent(each.user);
            setOrderToDelete({
                show: true,
                text: `¿Quieres borrar la order #${each.id}?`,
                id: each.id,
                matchValue: matchText
            })
        }
        switch(statusValue){
            case 0:
                mainOption = {icon:'arrow_right_alt',onClick:()=>promoteOrder(each.id),text:"Promover"}
                options = [
                    {icon:"description",onClick:()=>nav(`/orden/${each.id}`),text:"Ver detalles"},
                    {icon:"delete",onClick:deleteThisOrder,text:"Borrar"},
                ]
                break;
            case 1:
                mainOption = {icon:"list",onClick:()=>nav(`/orden/${each.id}`),text:"Editar lista"}
                options = [{icon:"delete",onClick:deleteThisOrder,text:"Borrar"}]
                break;
            case 2:
                const notifyThenPromote = async () => {
                    const response = await fetch(`/api/clothes_ready_message/${each.id}/`);
                    const {success,message} = await response.json();
                    if(success){
                        setNotify({show:true,
                            number:each.phone,
                            message:message,
                            backFunction: ()=>{setNotify({show:false})},
                            afterFunction: ()=>{promoteOrder(each.id);setNotify({show:false})}
                        })
                    }
                }
                mainOption = {icon: "arrow_right_alt", onClick: notifyThenPromote, text: "Notificar y promover"}
                options = [
                    {icon:"description", onClick:()=>nav(`/orden/${each.id}`), text:"Ver detalles"},
                    {icon:"delete", onClick: deleteThisOrder, text:"Borrar"}
                ]
                break;
            case 3:
                const notify = async () => {
                    const response = await fetch(`/api/clothes_ready_message/${each.id}/`);
                    const {success,message} = await response.json();
                    if(success){
                        setNotify({show:true,
                        number:each.phone,
                        message:message,
                        backFunction: ()=>{setNotify({show:false})},
                        })
                    }
                }
                mainOption = {icon: "point_of_sale", onClick: ()=>nav(`/orden/${each.id}`), text: "Pago"}
                options = [
                    {icon:"chat", onClick:notify, text:"Enviar recordatorio"},
                    {icon:"delete", onClick: deleteThisOrder, text:"Borrar"}
                ]
                break;
        }
        orders.push(<div className={`p-1 justify-center items-center flex gap-3 flex-wrap col-span-3 ${bg}`} key={each.id}>
            <OtherOptionButton
                user={each.user}
                id={each.id}
                mainOption={mainOption}
                options={options}
            />
        </div>);
    })
    return <div className="grid grid-cols-10 overflow-y-auto scrollbar-thin">
        {orders}
    </div>
};

export default AdminUser;


const OtherOptionButton = ({user,id,options,mainOption}) => {
    const [show,setShow] = useState(false)

    const menuOptions = [{icon:"undo",onClick:()=>setShow(false),text:"Regresar"},mainOption].concat(options).map(each=>{
        const showFalseThen = () => {
            setShow(false);
            each.onClick();
        }
        return <button 
            className="flex w-full gap-2 px-2 py-1 hover:bg-sky-200 hover:text-sky-800 items-center" 
            key={each.icon} 
            onClick={showFalseThen}>
                <Icon icon={each.icon}/>
                {each.text}
        </button>
    })

    return <>
        <IconButton onClick={()=>setShow(true)} icon='more_horiz'/>
        <IconButton onClick={mainOption.onClick} icon={mainOption.icon}/>
        {show&&<ModalConfirm clickOutside={()=>setShow(false)} noPadding={true} show={show}>
            <div className="rounded-md divide-y-[1px] divide-slate-300 overflow-hidden">
                <h2 className="px-4 py-2">
                    Orden {id}: {user}
                </h2>
                {menuOptions}
            </div>
        </ModalConfirm>}
    </>
} 
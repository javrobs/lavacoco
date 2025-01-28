import React,{useState, useContext, useRef, useEffect} from "react";
import {useLoaderData,useNavigate} from "react-router"
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import ModalWarning from "../../components/ModalWarning.jsx";
import MiniIconButton from "../../components/MiniIconButton.jsx";
import SubMenuButton from "../../components/SubMenuButton.jsx";
import OrderList from "./OrdenList.jsx";
import {userContext} from "../../components/App.jsx"

const Orden = () => {
    const {order} = useLoaderData();
    const {superuser} = useContext(userContext);
    console.log(order)

    const statusNames = ['Nueva','Abierta',"Cerrada","Lista","Terminada"];

    if(order.status == 1 && superuser){
        return <OrderList/>
    } else {
        return <main className="container mx-auto my-2">
            <div className="bubble-div flex gap-1 flex-col p-4">
                <h1 className="text-orange-700">Orden de {order.user}</h1>
                <div><b>Entrega:</b> {order.date}</div>
                <div><b>Estado de orden:</b> {statusNames[order.status]}</div>
            </div>
        </main>
    }
    return 
    
}

export default Orden;
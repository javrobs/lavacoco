import React,{useContext} from "react";
import {useLoaderData} from "react-router"
import OrderList from "./OrdenList.jsx";
import {userContext} from "../../components/App.jsx"
import OrdenTotals from "./OrdenTotals.jsx";
import Payment from "./Payment.jsx";

const Orden = () => {
    const {order,prices,order_list,others_start,discounts_applied} = useLoaderData();
    const {superuser} = useContext(userContext);

    const passOrder = {orderList: order_list,
        mediaCarga: order.has_half,
        others: others_start,
        discountsApplied:discounts_applied
        };


    const statusNames = ['Nueva','En proceso',"Confirmada","Lista","Terminada"];

    console.log(order.status == 3 && superuser && <Payment/>)

    switch(true){
        case order.status == 1 && superuser:
            return <OrderList/>
        default:
            return <main className="container mx-auto max-w-screen-md my-2 flex gap-2 flex-col">
            <div className="bubble-div flex gap-2 flex-col p-4">
                <h1 className="text-orange-700">#{order.id} - {order.user}</h1>
                <div><b>Entrega:</b> {order.date}</div>
                <div><b>Estado de orden:</b> {statusNames[order.status]}</div>
                {(Object.keys(passOrder.orderList).length > 0 || 
                passOrder.mediaCarga ||
                passOrder.others.length > 0) &&
                <OrdenTotals
                    order={passOrder}
                    prices={prices}
                    edit={false}
                />}
                
            </div>
            {order.status == 3 && superuser && <Payment/>}
        </main>
    }
}

export default Orden;
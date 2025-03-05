import React from "react";
import {Link} from "react-router";

const TimeAndOrder = ({orders}) => {

    const ordersList = orders.map((each,i)=>{
        return <div key={`order-${each.id} `} className={`${i % 2 ? "":"bg-slate-200"} flex`}>
            <div className="w-24 shrink-0 px-1 text-center">{each.time}</div>
            <div className="w-24 shrink-0 px-1 text-center">{each.status}</div>
            <Link to={`/orden/${each.id}`} className="grow px-1 overflow-hidden text-ellipsis text-nowrap">{each.concept}</Link>
        </div>
    })
    return <div className=" bubble-div-with-title">
        <div className="flex bg-blue-900 text-white font-semibold">
            <div className="w-24 shrink-0 px-1 text-center">Hora</div>
            <div className="w-24 shrink-0 px-1 text-center">Estado</div>
            <div className="grow px-1">Orden</div>
        </div>
        {ordersList}
        </div>
}


export default TimeAndOrder;
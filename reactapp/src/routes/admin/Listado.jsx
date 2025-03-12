import React, {useState, useEffect} from "react";
import { useLoaderData, useNavigate} from "react-router";
import TimeAndOrder from "../../components/TimeAndOrder.jsx"
import MainContainer from "../../components/MainContainer.jsx";
import DateSelector from "../../components/DateSelector.jsx";


const Listado = () => {
    const {orders} = useLoaderData();
    
    return <MainContainer size="md">
        <div className="bubble-div">
            <div className="flex max-sm:flex-col max-sm:items-stretch items-end gap-3">
                <h1 className="text-orange-700">Listado</h1>
                <DateSelector url="listado"/>
            </div>
        </div>
        <TimeAndOrder orders={orders}/>
    </MainContainer>
}

export default Listado;
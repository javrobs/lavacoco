import React, {useState} from "react";
import { useLoaderData, useNavigate } from "react-router";
import TimeAndOrder from "../../components/TimeAndOrder.jsx"
import HoverInput from "../../components/HoverInput.jsx";
import Icon from "../../components/Icon.jsx";

const Listado = () => {
    const {success,dateSelected,orders} = useLoaderData();
    const [date,setDate] = useState(dateSelected);
    const navigator = useNavigate();


    function redirectToDate(){
        navigator(`/listado/${date.split("-").reverse().join("/")}`)
    }

    function checkForEnter(e){
        if(e.key == "Enter"){
            redirectToDate();
        }
    }

    return <main className="container mx-auto max-w-screen-md sm:py-3 flex flex-col gap-3">
        <div className="bubble-div">
            <div className="flex items-end gap-3">
                <h1 className="text-orange-700">Lavadoras</h1>
                <div className="flex items-end grow">
                <HoverInput className="flex items-center !grow" label="Selecciona fecha">
                    <input type="date" className="!rounded-e-none" value={date} onKeyDown={checkForEnter} onInput={(e)=>setDate(e.target.value)}/>
                </HoverInput>
                <button className="btn-go flex items-center gap-1 !text-md !rounded-s-none !h-8" onClick={redirectToDate}>Ir<Icon icon="arrow_forward"/></button>
                </div>
            </div>
        </div>
        <TimeAndOrder orders={orders}/>
    </main>
}

export default Listado;
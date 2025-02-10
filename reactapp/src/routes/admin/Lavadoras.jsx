import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import TimeAndOrder from "../../components/TimeAndOrder.jsx"
import HoverInput from "../../components/HoverInput.jsx";

const Lavadoras = () => {
    const {success,dateSelected,orders} = useLoaderData();
    const navigator = useNavigate();


    function redirectToDate(e){
        navigator(`/lavadoras/${e.target.value.split("-").reverse().join("/")}`)
    }

    return <main className="container mx-auto max-w-screen-md sm:py-3 flex flex-col gap-3">
        <div className="bubble-div">
            <div className="flex items-end gap-3">
                <h1 className="text-orange-700">Lavadoras</h1>
                <HoverInput className="flex items-center grow" label="Selecciona fecha">
                    <input type="date" value={dateSelected} onInput={redirectToDate}/>
                </HoverInput>
            </div>
        </div>
        <TimeAndOrder orders={orders}/>
    </main>
}

export default Lavadoras;
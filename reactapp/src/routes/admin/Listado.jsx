import React, {useState, useEffect} from "react";
import { useLoaderData, useNavigate} from "react-router";
import TimeAndOrder from "../../components/TimeAndOrder.jsx"
import HoverInput from "../../components/HoverInput.jsx";
import Icon from "../../components/Icon.jsx";
import MainContainer from "../../components/MainContainer.jsx";

const Listado = () => {
    const {dateSelected,orders,dateForward,dateBack} = useLoaderData();
    const [date,setDate] = useState("");
    const navigator = useNavigate();

    useEffect(()=>setDate(dateSelected),[dateSelected])


    function redirectToDate(){
        navigator(`/listado/${date.split("-").reverse().join("/")}`)
    }

    function checkForEnter(e){
        if(e.key == "Enter"){
            redirectToDate();
        }
    }

    function redirectBack(){
        navigator(`/listado/${dateBack.split("-").reverse().join("/")}`)
    }

    function redirectForward(){
        navigator(`/listado/${dateForward.split("-").reverse().join("/")}`)
    }

    return <MainContainer size="md">
        <div className="bubble-div">
            <div className="flex max-sm:flex-col max-sm:items-stretch items-end gap-3">
                <h1 className="text-orange-700">Lavadoras</h1>
                <div className="flex items-end grow">
                    <button className="btn-white flex items-center gap-1 !text-md !rounded-e-none !h-8" onClick={redirectBack}><Icon icon="arrow_back"/></button>
                    {dateForward && <button className="btn-white flex items-center gap-1 !text-md !rounded-none !h-8" onClick={redirectForward}><Icon icon="arrow_forward"/></button>}
                    <HoverInput className="flex items-center !grow" label="Selecciona fecha">
                        <input type="date" className="!rounded-none" value={date} onKeyDown={checkForEnter} onInput={(e)=>setDate(e.target.value)}/>
                    </HoverInput>
                    <button className="btn-go flex items-center gap-1 !text-md !rounded-s-none !h-8" onClick={redirectToDate}>Ir<Icon icon="event_upcoming"/></button>
                </div>
            </div>
        </div>
        <TimeAndOrder orders={orders}/>
    </MainContainer>
}

export default Listado;
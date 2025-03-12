
import React, {useState, useEffect} from "react";
import { useLoaderData, useNavigate } from "react-router";
import HoverInput from "./HoverInput.jsx";
import Icon from "./Icon.jsx";

const DateSelector = ({url}) => {
    const {dateBack,dateSelected,dateForward,redirect} = useLoaderData();
    const [date,setDate] = useState(dateSelected);
    const navigator = useNavigate();
    
    useEffect(()=>setDate(dateSelected),[dateSelected])

    useEffect(()=>{
        if(redirect){
            navigator(`/${url}/`);
            setDate(dateSelected);
        }
    },[redirect])

    function redirectToDate(){
        navigator(`/${url}/${date.split("-").reverse().join("/")}`)
    }


    function checkForEnter(e){
        if(e.key == "Enter"){
            redirectToDate();
        }
    }

    function redirectBack(){
        navigator(`/${url}/${dateBack.split("-").reverse().join("/")}`)
    }

    function redirectForward(){
        navigator(`/${url}/${dateForward.split("-").reverse().join("/")}`)
    }

    return <div className="flex items-end grow">
    <button className="btn-white flex items-center gap-1 !text-md !rounded-e-none !h-8" onClick={redirectBack}><Icon icon="arrow_back"/></button>
    {dateForward && <button className="btn-white flex items-center gap-1 !text-md !rounded-none !h-8" onClick={redirectForward}><Icon icon="arrow_forward"/></button>}
    <HoverInput className="flex items-center !grow" label="Selecciona fecha">
        <input type="date" className="!rounded-none" value={date} onKeyDown={checkForEnter} onInput={(e)=>setDate(e.target.value)}/>
    </HoverInput>
    <button className="btn-go flex items-center gap-1 !text-md !rounded-s-none !h-8" onClick={redirectToDate}>Ir<Icon icon="event_upcoming"/></button>
    </div>
}


export default DateSelector;
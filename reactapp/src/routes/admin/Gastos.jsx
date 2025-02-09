import React, {useState, useRef, useEffect} from "react";
import { useLoaderData } from "react-router";
import HoverSelect from "../../components/HoverSelect.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import Icon from "../../components/Icon.jsx";
import ListOfPayments from "../../components/ListOfPayments.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import defaultLoader from "../../utils/defaultLoader.js";
import MiniIconButton from "../../components/MiniIconButton.jsx";


const Gastos = () => {
    const {success,...load} = useLoaderData();
    const [movementState,setMovementState] = useState(load);
    const [newSelect, setNewSelect] = useState(false);
    const [sendState, setSendState] = useState({});
    const [error,setError] = useState("");
    const catInputRef = useRef(null);

    console.log(movementState);

    function handleInput(e){
        const {value,name} = e.target;
        modifyState(value,name)
    }

    function categoryHandleSelect(e){
        const {value,name} = e.target;
        if(value == "new_cat_change"){
            setNewSelect(true);
            modifyState("",name);
        } else {
            modifyState(value,name);
        }
    }

    function modifyState(value,name){
        setSendState(oldValue=>({...oldValue,[name]:value}))
    }

    async function handleForm(e){
        e.preventDefault();
        const response = await fetch("/api/spending_payment/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(sendState)
        });
        const data = await response.json();
        if(data.success){
            const {success,...getFreshState} = await defaultLoader("spending");
            setMovementState(getFreshState);
            setSendState({});
            setError("");
        } else {
            setError(data.error);
        }
    }

    useEffect(()=>{
        if(newSelect){
            catInputRef.current.focus();
        }
    },[newSelect])

    return <main className="container flex flex-col max-w-screen-md mx-auto sm:gap-3 py-3">
            <div className="bubble-div grid">
                <h1 className="text-orange-700">Gastos</h1>
                <ErrorMessage errorContent={error}/>
                <form className="flex divide-x-[1px] divide-slate-400 max-sm:flex-wrap items-center" autoComplete="off" onSubmit={handleForm}>
                    <div className="items-center flex gap-1 w-32 grow shrink-0">
                        <span className="mt-3">$</span>
                        <HoverInput label='Cantidad'>
                            <input className="no-arrow !max-sm:!rounded-none !rounded-e-none" ref={catInputRef} type="number" min={0} name="amount" value={sendState?.amount||""} onInput={handleInput} required={true}/>
                        </HoverInput>
                    </div>
                    {newSelect?
                        <div className="relative flex items-center grow-[20] max-sm:basis-full">
                            <HoverInput className="grow" label='Añadir gasto'>
                            <input className="" ref={catInputRef} name="category" type="text" value={sendState?.category||""} onInput={handleInput} required={true}/>
                            </HoverInput>
                            <MiniIconButton classNameExtra="absolute mt-3" onClick={()=>{setNewSelect(false)}} icon="undo"/>
                        </div>:
                        <HoverSelect className="grow-[20] max-sm:basis-full" label='Añadir gasto'>
                            <select className="!rounded-none" value={sendState?.category||""} name="category" onChange={categoryHandleSelect} required={true}>
                                <option value="" disabled={true}>Selecciona...</option>
                                {movementState.categories.map((each,i)=><option key={`option-${i}`} value={each}>{each}</option>)}
                                <option className="bg-blue-200" value="new_cat_change">Nueva categoría</option>
                            </select>
                        </HoverSelect>
                    }
                    <button className="btn-go mt-3 btn !text-base !max-sm:!rounded-none !rounded-s-none text-nowrap grow !w-32 !h-8">Enviar<Icon icon="payments"/></button>
                </form>
            </div>
            <div className="bubble-div-with-title">
                <div className="bubble-div-title"> Gastos recientes<Icon icon='paid'/></div>
                <ListOfPayments movementState={movementState} setMovementState={setMovementState} loader="spending"/>
            </div>
        </main>
}

export default Gastos;
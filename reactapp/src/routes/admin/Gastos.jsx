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
import MainContainer from "../../components/MainContainer.jsx";


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
            refreshState();
            setSendState({});
            setError("");
            setNewSelect(false);
        } else {
            setError(data.error);
        }
    }
    
    async function refreshState(){
        const {success,...getFreshState} = await defaultLoader("spending");
        if(success) setMovementState(getFreshState);
    }

    function toggleCreditCard(){
        setSendState(oldValue=>({...oldValue,creditCard:!oldValue?.creditCard}))
    }

    useEffect(()=>{
        if(newSelect){
            catInputRef.current.focus();
        }
    },[newSelect])

    return <MainContainer size="md">
            <form className="bubble-div max-sm:!px-0 flex flex-col gap-1" autoComplete="off" onSubmit={handleForm}>
                <h1 className="text-orange-700 max-sm:px-3">Gastos</h1>
                <ErrorMessage errorContent={error}/>
                <form className="flex divide-x-[1px] divide-slate-400 max-sm:flex-wrap items-center" autoComplete="off" onSubmit={handleForm}>
                    <button type="button" className={`btn-white btn mt-3 !p-0 !text-base max-sm:!rounded-none !rounded-e-none !w-10 !h-8 ${sendState?.creditCard?"!text-emerald-700 !bg-emerald-200 hover:!bg-emerald-300":"!text-sky-700 !bg-sky-200 hover:!bg-sky-300"}`} onClick={toggleCreditCard}><Icon icon={sendState?.creditCard?"credit_card":"payments"}/></button>
                    <HoverInput label='Cantidad ($)' className="w-32 grow shrink-0">
                        <input className="no-arrow !rounded-none" ref={catInputRef} type="number" min={0} name="amount" value={sendState?.amount||""} onInput={handleInput} required={true}/>
                    </HoverInput>
                    {newSelect?
                        <div className="relative mt-3 flex items-center grow-[20] max-sm:basis-full">
                            <HoverInput className="grow !mt-0" label='Añadir gasto'>
                            <input className="!rounded-none" ref={catInputRef} name="category" type="text" value={sendState?.category||""} onInput={handleInput} required={true}/>
                            </HoverInput>
                            <MiniIconButton classNameExtra="absolute" onClick={()=>{setNewSelect(false)}} icon="undo"/>
                        </div>:
                        <HoverSelect className="grow-[20] max-sm:basis-full" label='Añadir gasto'>
                            <select className="!rounded-none" value={sendState?.category||""} name="category" onChange={categoryHandleSelect} required={true}>
                                <option value="" disabled={true}>Selecciona...</option>
                                {movementState.categories.map((each,i)=><option key={`option-${i}`} value={each}>{each}</option>)}
                                <option className="bg-blue-200" value="new_cat_change">Nueva categoría</option>
                            </select>
                        </HoverSelect>
                    }
                    <button className="btn-go mt-3 btn !text-base max-sm:!rounded-none !rounded-s-none text-nowrap grow !w-32 !h-8">Enviar<Icon icon="arrow_forward"/></button>
                </form>
            </div>
            <div className="bubble-div-with-title">
                <div className="bubble-div-title">Gastos recientes<Icon icon='paid'/></div>
                <ListOfPayments 
                    movementState={movementState} 
                    fetchURL="/api/edit_spending/" 
                    setMovementState={setMovementState} 
                    refreshState={refreshState}
                    loader="spending"
                />
            </div>
        </MainContainer>
}

export default Gastos;
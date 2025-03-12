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
        setSendState(oldValue=>{
            const newValue = Object.keys(oldValue).includes("paymentType")?
                {0:1, 1:2, 2:0}[oldValue.paymentType]: 1
            return {...oldValue,paymentType:newValue}
        })
        }
    
    console.log(sendState)

    useEffect(()=>{
        if(newSelect){
            catInputRef.current.focus();
        }
    },[newSelect])

    function returnToCatSelect(){
        setNewSelect(false);
        setSendState(oldValue=>{
            const {concept,...valuesToKeep} = oldValue;
            return valuesToKeep; 
        });
    }


    return <MainContainer size="md">
            <form className="bubble-div max-sm:!px-0 flex flex-col gap-1" autoComplete="off" onSubmit={handleForm}>
                <h1 className="text-orange-700 max-sm:px-3">Gastos</h1>
                <ErrorMessage errorContent={error}/>
                <div className="flex divide-x-[1px] divide-slate-400 max-sm:flex-wrap gap-y-1 items-center">
                    <button type="button" className={`btn-white btn mt-3 !text-base !p-0 max-sm:!rounded-none !rounded-e-none !w-24 !h-8 ${sendState?.paymentType?(sendState.paymentType==2?"!text-blue-700 !bg-blue-200 hover:!bg-blue-300":"!text-orange-700 !bg-orange-200 hover:!bg-orange-300"):"!text-green-700 !bg-green-200 hover:!bg-green-300"}`} onClick={toggleCreditCard}>
                        <Icon icon={sendState?.paymentType?(sendState.paymentType==2?"point_of_sale":"credit_card"):"payments"}/>
                        {sendState?.paymentType?(sendState.paymentType==2?"Caja":"Tarjeta"):"Efectivo"}
                    </button>
                    <HoverInput label='Cantidad ($)' className="w-32 grow shrink-0">
                        <input className="no-arrow !rounded-none" ref={catInputRef} type="number" min={0} name="amount" value={sendState?.amount||""} onInput={handleInput} required={true}/>
                    </HoverInput>
                    {newSelect?
                        <div className="relative mt-3 flex items-center grow-[20] max-sm:basis-full">
                            <HoverInput className="grow !mt-0" label='Añadir gasto'>
                            <input className="max-sm:!rounded-none !rounded-s-none" ref={catInputRef} name="concept" type="text" value={sendState?.concept||""} onInput={handleInput} required={true}/>
                            </HoverInput>
                            <MiniIconButton classNameExtra="absolute" onClick={returnToCatSelect} icon="undo"/>
                        </div>:
                        <HoverSelect className="grow-[20] max-sm:basis-full" label='Añadir gasto'>
                            <select className=" max-sm:!rounded-none !rounded-s-none" value={sendState?.concept||""} name="concept" onChange={categoryHandleSelect} required={true}>
                                <option value="" disabled={true}>Selecciona...</option>
                                {movementState.categories.map((each,i)=><option key={`option-${i}`} value={each}>{each}</option>)}
                                <option className="bg-blue-200" value="new_cat_change">Nueva categoría</option>
                            </select>
                        </HoverSelect>
                    }
                </div>
                {Boolean(sendState.concept)&&Boolean(sendState.amount)&&<><label className="gap-1 max-sm:px-3 flex items-center self-center">
                    <input className="accent-sky-600" type='checkbox' required/>
                    <span>
                        Pagué ${sendState.amount} de "{sendState.concept}" mediante <b>{sendState?.paymentType?(sendState.paymentType==2?"caja":"tarjeta"):"efectivo"}</b>.
                    </span>
                </label>
                <button className="btn-go btn text-nowrap self-center">Enviar<Icon icon="arrow_forward"/></button>
                </>
                }
            </form>
            <div className="bubble-div-with-title">
                <div className="bubble-div-title">Gastos recientes<Icon icon='paid'/></div>
                <ListOfPayments 
                    movementState={movementState} 
                    fetchURL="/api/edit_spending/" 
                    setMovementState={setMovementState} 
                    refreshState={refreshState}
                    loader="spending"
                    modifyConcepts={true}
                />
            </div>
        </MainContainer>
}

export default Gastos;
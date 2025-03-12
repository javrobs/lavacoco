import React, {useState, useRef} from "react"
import { useLoaderData} from "react-router";
import Icon from "../../components/Icon.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import defaultLoader from "../../utils/defaultLoader.js";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import ListOfPayments from "../../components/ListOfPayments.jsx";
import MainContainer from "../../components/MainContainer.jsx";

const Tintoreria = () => {
    const {success,...load} = useLoaderData();
    const [movementState,setMovementState] = useState(load)
    const [amount, setAmount] = useState("");
    const [error,setError] = useState('');
    const inputRef = useRef(null);

    const {total} = movementState;


    function handleInput(e){
        const {value} = e.target;
        const pattern = new RegExp(/^[0-9]*$/);
        if(pattern.test(value)){
            setAmount(value);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        const response = await fetch('/api/dryclean_payment/',{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({amount:amount})
        })
        const data = await response.json();
        if(data.success){
            refreshState();
            inputRef.current.blur();
            setAmount("");
            setError("");
        } else {
            setError(data.error);
        }
    }

    async function refreshState(){
        const {success,...getFreshState} = await defaultLoader("drycleaning");
        if(success) setMovementState(getFreshState);
    }


    return <MainContainer size='md'>
        <div className="bubble-div max-sm:!p-2 flex flex-col">
            <h1 className="text-orange-700">Tintorería</h1>
            {Boolean(total)? <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <ErrorMessage errorContent={error}/>
                <div className="flex divide-x-[1px] divide-slate-400 items-end">
                    <HoverInput label="Cantidad" className="grow">
                        <input ref={inputRef} className={`shadow-sm !rounded-e-none max-sm:!rounded-none no-arrow`} min={0} max={-total} required={true} type="number" value={amount} onChange={handleInput}/>
                    </HoverInput> 
                    <button className="btn-go max-sm:!rounded-none !rounded-s-none !text-base text-nowrap justify-center !h-8 flex gap-1 items-center !w-32">
                        Enviar
                        <Icon icon='arrow_forward'/>
                    </button>
                </div>
            </form>:
            <p className="mt-2">No hay pagos pendientes de tintorería, estás al día.</p>}
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">
                <span className="me-auto">
                    Pendiente: <span className="text-orange-300 font-bold">
                        $ {-total}
                    </span>
                </span>
                Movimientos recientes
                <Icon icon='dry_cleaning'/>
            </div>
            <ListOfPayments 
                movementState={movementState} 
                fetchURL="/api/edit_drycleaning/" 
                setMovementState={setMovementState}
                refreshState={refreshState}
                loader="drycleaning"
            />
        </div>
    </MainContainer>
}

export default Tintoreria;

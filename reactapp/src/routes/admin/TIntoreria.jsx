import React, {useState, useRef} from "react"
import { useLoaderData} from "react-router";
import Icon from "../../components/Icon.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import defaultLoader from "../../utils/defaultLoader.js";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import ListOfPayments from "../../components/ListOfPayments.jsx";

const Tintoreria = () => {
    const {success,...load} = useLoaderData();
    const [movementState,setMovementState] = useState(load)
    const [payment, setPayment] = useState("");
    const [error,setError] = useState('');
    const inputRef = useRef(null);

    const {total} = movementState;

    function handleInput(e){
        const {value} = e.target;
        const pattern = new RegExp(/^[0-9]*$/);
        if(pattern.test(value)){
            setPayment(value);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        const response = await fetch('/api/dryclean_payment/',{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({payment:payment})
        })
        const data = await response.json();
        if(data.success){
            const {success,...getFreshState} = await defaultLoader("drycleaning");
            if(success) setMovementState(getFreshState);
            inputRef.current.blur();
            setPayment("");
            setError("");
        } else {
            setError(data.error);
        }
    }


    return <main className="container mx-auto max-w-screen-md flex flex-col py-4 sm:gap-2">
        <div>
            <h1 className="text-orange-700 px-2">Tintorería</h1>
            {total != 0 && <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <ErrorMessage errorContent={error}/>
                <div className="flex items-end">
                <HoverInput label="Abonar pago" className="grow">
                    <input ref={inputRef} className="shadow-sm max-sm:!rounded-none !rounded-e-none no-arrow" min={0} max={-total} required={true} type="number" value={payment} onChange={handleInput}/>
                </HoverInput> 
                <button className="btn btn-go max-sm:!rounded-none !rounded-s-none !text-base text-nowrap !h-8">
                    Enviar
                    <Icon icon='payments'/>
                </button>
                </div>
            </form>}
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title"><span className="me-auto">Pendiente: <span className="text-orange-300 font-bold">$ {-total}</span>    </span>Movimientos recientes<Icon icon='dry_cleaning'/></div>
            <ListOfPayments movementState={movementState} setMovementState={setMovementState} loader="drycleaning"/>
        </div>
    </main>
}

export default Tintoreria;

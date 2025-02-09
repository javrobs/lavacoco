import React, {useState, useRef} from "react"
import { useLoaderData, Link} from "react-router";
import Icon from "../../components/Icon.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import defaultLoader from "../../utils/defaultLoader.js";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import MiniIconButton from "../../components/MiniIconButton.jsx";

const Tintoreria = () => {
    const {success,...load} = useLoaderData();
    const [movementState,setMovementState] = useState(load)
    const [payment, setPayment] = useState("");
    const [error,setError] = useState('');
    const inputRef = useRef(null);
    const pageInput = useRef(null);

    const {movements,total} = movementState;

    console.log(movementState)

    const listOfPayments = movements.map((each,i)=>{
        const rearrangeDate = each.date.split("-").reverse().join("/")

        return <div className={`flex bg-opacity-50 ${each.due>0?"bg-sky-200":"bg-orange-200"}`} key={i}>
            <div className="px-1 shrink-0 w-24 text-center">{rearrangeDate}</div>
            <div className="px-1 shrink-0 w-24 text-center">{each.due>0? "$ " + each.due:"$ (" + (-each.due) + ")"}</div>
            <div className="grow shrink overflow-hidden px-1 text-nowrap text-ellipsis">{each.id?<Link className="hover:!text-orange-500 text-orange-700" to={`/orden/${each.id}`}>{each.concept}</Link>:each.concept}</div>
            
        </div>
    })

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

    async function backPage(){
        const {success, ...getFreshState} = await defaultLoader("drycleaning",movementState.page-1);
        if(success){
            setMovementState(getFreshState);
            pageInput.current.value = getFreshState.page;
        }
    }

    async function nextPage(){
        const {success, ...getFreshState} = await defaultLoader("drycleaning",movementState.page+1);
        if(success){
            setMovementState(getFreshState);
            pageInput.current.value = getFreshState.page;
        }
    }

    async function changePage(e){
        let {value} = e.target;
        value = Number(value);
        if(value > movementState.num_pages) value = movementState.num_pages;
        if(value > 0){
            const {success,...getFreshState} = await defaultLoader("drycleaning",value);
            if(success){
                setMovementState(getFreshState);
                pageInput.current.value = getFreshState.page;
                pageInput.current.blur();
            }
        }
    }

    async function changePageOnEnter(e){
        console.log(e,e.target.value);
        if(e.key=="Enter") changePage(e);
        // let {value} = 
    }

    return <main className="container mx-auto max-w-screen-md flex flex-col py-4 gap-2">
        <div>
            <h1 className="text-orange-700">Tintorería</h1>
            {total != 0 && <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <ErrorMessage errorContent={error}/>
                <div className="flex items-end">
                <HoverInput label="Abonar pago" className="grow">
                    <input ref={inputRef} className="shadow-sm !rounded-e-none no-arrow" min={0} max={-total} required={true} type="number" value={payment} onChange={handleInput}/>
                </HoverInput> 
                <button className="btn btn-go !rounded-s-none !text-base text-nowrap !h-8">
                    Enviar
                    <Icon icon='payments'/>
                </button>
                </div>
            </form>}
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title"><span className="me-auto">Pendiente: <span className="text-orange-300 font-bold">$ {-total}</span>    </span>Movimientos recientes<Icon icon='dry_cleaning'/></div>
            <div className="divide-y-[1px] divide-slate-500">
                <div className="flex">
                    <div className="px-1 shrink-0 w-24 text-center">Fecha</div>
                    <div className="px-1 shrink-0 w-24 text-center">Cantidad</div>
                    <div className="grow px-1">Concepto</div>
                    
                </div>
                {listOfPayments}
                {movementState.num_pages > 1 && <div className="flex justify-center gap-1 py-1 items-center">
                    <MiniIconButton icon="chevron_backward" onClick={backPage} disabled={movementState.page == 1}/>
                    <input ref={pageInput} className="!w-12 !h-6" onBlur={changePage} onKeyDown={changePageOnEnter} defaultValue={movementState.page}/> de {movementState.num_pages}
                    <MiniIconButton icon="chevron_forward" onClick={nextPage} disabled={movementState.page == movementState.num_pages}/>
                </div>}
            </div>
        </div>
    </main>
}

export default Tintoreria;

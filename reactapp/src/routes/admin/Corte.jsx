import React, {useState} from "react";
import { useLoaderData, useNavigate } from "react-router";
import MainContainer from "../../components/MainContainer.jsx";
import Icon from "../../components/Icon.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import ListOfPayments from "../../components/ListOfPayments.jsx";
import DateSelector from "../../components/DateSelector.jsx";
import defaultPost from "../../utils/defaultPost.js";


const Corte = () => {
    const {success,active,dayCutout,dateSelected,...load} = useLoaderData();
    const [amount, setAmount] = useState("");
    const navigator = useNavigate();

    const {total} = load;
    console.log(useLoaderData())

    function handleInput(e){
        const {value} = e.target;
        const pattern = new RegExp(/^[0-9]*$/);
        if(pattern.test(value)){
            setAmount(value);
        }
    }

    async function handleSubmit(e){
        e.preventDefault();
        const data = await defaultPost("/api/set_cutout/",{date:dateSelected,amount:amount})
        if(data.success){
            navigator("");
        }
    }

    async function refreshState(){
        // const {success,...getFreshState} = await defaultLoader("closeout");
        // if(success) setMovementState(getFreshState);
    }

    

    return <MainContainer size="md">
        <div className="bubble-div max-sm:!p-2 flex flex-col">
            <div className="flex max-sm:flex-col max-sm:items-stretch items-end gap-3">
                <h1 className="text-orange-700">Corte</h1>
                <DateSelector 
                    url="corte"
                />
            </div>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">
                <span className="me-auto">
                    Balance en caja: <span className="text-orange-300 font-bold">
                        $ {total}
                    </span>
                </span>
                Movimientos recientes
                <Icon icon='point_of_sale'/>
            </div>
            <ListOfPayments 
                movementState={load} 
                fetchURL="/api/edit_cutout/" 
                setMovementState={()=>{}}
                refreshState={refreshState}
                loader="drycleaning"
                nodate={true}
            />
        </div>
        {dayCutout!==undefined?
            <div className="bubble-div-title rounded-xl text-lg !justify-start shadow-md">
                Se hizo corte en la caja con: <span className="text-orange-300 font-bold">${dayCutout}</span>
            </div>:
        active&&
        <div className="bubble-div max-sm:!p-2 flex flex-col">
            <p>Si el corte es correcto, introduce la cantidad de efectivo restante para el día siguiente:</p>
            
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="flex divide-x-[1px] divide-slate-400 items-end">
                    <HoverInput label="Cantidad" className="grow">
                        <input className={`shadow-sm max-sm:!rounded-none no-arrow`} min={0} required={true} type="number" value={amount} onChange={handleInput}/>
                    </HoverInput> 
                    
                </div>
                {amount!=="" && amount>=0 &&
                <>
                <label className="flex gap-1 items-center self-center">
                    <input className="accent-sky-600" type='checkbox' required/> Voy a dejar ${amount} en caja.
                </label>
                {amount>total && <label className="flex gap-1 items-center self-center">
                    <input className="accent-sky-600" type='checkbox' required/> Voy a agregar dinero a la caja, actualmente hay ${total}, voy a agregar ${amount-total}.
                </label>}
                <button className="btn-go btn self-center text-nowrap">
                        Enviar
                        <Icon icon='arrow_forward'/>
                </button>
                </>
                }
            </form>
        </div>
        }
    </MainContainer>
}

export default Corte

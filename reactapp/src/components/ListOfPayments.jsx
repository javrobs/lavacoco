import React,{useEffect, useRef, useState} from "react";
import MiniIconButton from "./MiniIconButton.jsx";
import { Link } from "react-router";
import defaultLoader from "../utils/defaultLoader.js";
import Icon from "./Icon.jsx";
import cookieCutter from "../utils/cookieCutter.js";

const ListOfPayments = ({movementState,setMovementState,loader,refreshState, fetchURL}) => {
    const {movements} = movementState;
    const [edit,setEdit] = useState({});
    const pageInput = useRef(null);
    const editInput = useRef(null);

    useEffect(()=>{
        if(edit.id){
            editInput.current.focus();
    }},[edit])
    
    const saveEdits = async (e) => {
        const response = await fetch(fetchURL,{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(edit)
        });
        const {success} = await response.json();
        if(success){
            refreshState();
        }
        setEdit({});
    }

    const selectEdit = (id) => {
        const {due,cardPayment} = movements.find((each) => each.id == id);
        setEdit({id:id,due:due,cardPayment:cardPayment})
    }
    
    const editDue = (e) => {
        const {value} = e.target;
        setEdit(oldValue=>({...oldValue,due:Number(value)}));
    }

    const togglePayment = () => {
        setEdit(oldValue=>({...oldValue,cardPayment:!oldValue.cardPayment}));
    }

    const hasCardPayments = movements.length>0 && Object.keys(movements[0]).includes("cardPayment");
    
    const listOfPayments = movements.map((each)=>{
        const rearrangeDate = each.date.split("-").reverse().join("/");

        return <div className="flex bg-opacity-50 items-center" key={each.id}>
            {hasCardPayments &&
                (each.id == edit.id?
                <button onClick={togglePayment} className={`px-1 shrink-0 w-14 !h-6 text-center ${edit.cardPayment?"text-emerald-700 bg-emerald-200 hover:bg-emerald-300":"text-sky-700 bg-sky-200 hover:bg-sky-300"}`}>
                    <Icon icon={edit.cardPayment?"credit_card":"payments"}/>
                </button>:
                <div className="px-1 shrink-0 w-14 !h-6 text-center">
                    <Icon icon={each.cardPayment?"credit_card":"payments"}/>
                </div>)
            }
            <div className="px-1 shrink-0 w-24 text-center">{rearrangeDate}</div>
            <div className="px-1 shrink-0 w-24 text-center">
                {each.id == edit.id?
                <input className="!h-6 !w-16 no-arrow" type="number" value={edit.due||""} ref={editInput} onChange={editDue}/>:
                (each.due > 0 ? "$ " + each.due : "$ (" + (-each.due) + ")")
                }
            </div>
            <div className="px-1 grow overflow-hidden text-nowrap text-ellipsis">
                {each.id_order?
                <Link className="hover:!text-orange-500 text-orange-700" to={`/orden/${each.id_order}`}>{each.concept}</Link>:
                <>{each.concept}</>
                }
            </div>
            {each.id == edit.id?
            <><MiniIconButton classNameExtra="me-1 shrink-0 text-black !bg-red-200 hover:!bg-red-300" icon="undo" onClick={()=>{setEdit({})}}/>
            <MiniIconButton classNameExtra="me-1 shrink-0 text-black !bg-emerald-200 hover:!bg-emerald-300" icon="arrow_forward" onClick={saveEdits}/></>:
            !each.id_order&&<MiniIconButton classNameExtra="me-1 shrink-0 text-black" icon="edit" onClick={()=>{selectEdit(each.id)}}/>}
        </div>
    })

    async function backPage(){
        const {success, ...getFreshState} = await defaultLoader(loader,movementState.page-1);
        if(success){
            setMovementState(getFreshState);
            pageInput.current.value = getFreshState.page;
        }
    }

    async function nextPage(){
        const {success, ...getFreshState} = await defaultLoader(loader,movementState.page+1);
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
            const {success,...getFreshState} = await defaultLoader(loader,value);
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
    }

    return <div className="divide-y-[1px] divide-slate-500">
    <div className="flex">
        {hasCardPayments && <div className="px-1 shrink-0 w-14 text-center">Pago</div>}
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
}


export default ListOfPayments
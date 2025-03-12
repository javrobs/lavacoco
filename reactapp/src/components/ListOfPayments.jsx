import React,{useEffect, useRef, useState} from "react";
import MiniIconButton from "./MiniIconButton.jsx";
import { Link } from "react-router";
import Icon from "./Icon.jsx";
import cookieCutter from "../utils/cookieCutter.js";
import Paginator from "./Paginator.jsx";
import defaultPost from "../utils/defaultPost.js";

const ListOfPayments = ({movementState, setMovementState, loader, refreshState, fetchURL, modifyConcepts}) => {
    const {movements} = movementState;
    const [edit,setEdit] = useState({});
    const editInput = useRef(null);

    useEffect(()=>{
        if(edit.id){
            editInput.current.focus();
    }},[edit.id])
    
    const saveEdits = async (e) => {
        e.preventDefault();
        const {success,error} = await defaultPost(fetchURL,edit);
        if(success){
            refreshState().then(()=>setEdit({}));
        } else {
            setEdit(oldValue=>({...oldValue,error:error}))
        }
    }

    const selectEdit = (id) => {
        const {amount,paymentType,concept} = movements.find((each) => each.id == id);
        setEdit({id:id,amount:amount,paymentType:paymentType,concept:concept})
    }
    
    const changeEdit = (e) => {
        const {name, value} = e.target;
        setEdit(oldValue=>({...oldValue,[name]:value}));
    }

    const togglePayment = () => {
        setEdit(oldValue=>{
            const newValue = Object.keys(oldValue).includes("paymentType")?
                {0:1, 1:2, 2:0}[oldValue.paymentType]: 1
            return {...oldValue,paymentType:newValue}}
        );
    }

    const listOfPayments = movements.map((each)=>{
        return each.id == edit.id?
            <form className="flex bg-opacity-50 items-center" key={each.id}  onSubmit={saveEdits}>
                {modifyConcepts && <button type="button" onClick={togglePayment} className={`px-1 shrink-0 w-14 !h-6 text-center ${edit.paymentType?(edit.paymentType==2?"text-blue-700 bg-blue-200 hover:bg-blue-300":"text-orange-700 bg-orange-200 hover:bg-orange-300"):"text-green-700 bg-green-200 hover:bg-green-300"}`}>
                    <Icon icon={edit.paymentType?(edit.paymentType==2?"point_of_sale":"credit_card"):"payments"}/>
                </button>}
                <div className="px-1 shrink-0 w-24 text-center">{each.date}</div>
                <div className="px-1 shrink-0 w-24 text-center">
                    <input className={`!h-6 !w-16 no-arrow ${edit.error=="amount"?"shake":""}`} type="number" name="amount" value={edit.amount||""} ref={editInput} onChange={changeEdit}/>
                </div>
                <div className="px-1 grow overflow-hidden text-nowrap text-ellipsis">
                {each.id_order?
                <Link className="hover:!text-orange-500 text-orange-700" to={`/orden/${each.id_order}`}>{each.concept}</Link>:
                modifyConcepts?
                    <input className={`!h-6 ${edit.error=="concept"?"shake":""}`} type="text" name="concept" value={edit.concept||""} onChange={changeEdit}/>:
                    <>{each.concept}</>
                }
                </div>
                <MiniIconButton classNameExtra="me-1 shrink-0 text-black !bg-red-200 hover:!bg-red-300" icon="undo" onClick={()=>{setEdit({})}}/>
                <MiniIconButton type="submit" classNameExtra="me-1 shrink-0 text-black !bg-emerald-200 hover:!bg-emerald-300" icon="arrow_forward"/>
            </form>
        :
            <div className="flex bg-opacity-50 items-center" key={each.id}>
                {modifyConcepts && <div className="px-1 shrink-0 w-14 !h-6 text-center">
                    <Icon icon={each.paymentType?(each.paymentType==2?"point_of_sale":"credit_card"):"payments"}/>
                </div>}
                <div className="px-1 shrink-0 w-24 text-center">{each.date}</div>
            <div className="px-1 shrink-0 w-24 text-center">
                {each.amount > 0 ? "$ " + each.amount : "$ (" + (-each.amount) + ")"}
            </div>
            <div className="px-1 grow overflow-hidden text-nowrap text-ellipsis">
                {each.id_order?
                <Link className="hover:!text-orange-500 text-orange-700" to={`/orden/${each.id_order}`}>{each.concept}</Link>:
                <>{each.concept}</>
                }
            </div>
            {(!each.id_order && !each.type) && <MiniIconButton classNameExtra="me-1 shrink-0 text-black" icon="edit" onClick={()=>{selectEdit(each.id)}}/>}
        </div>
    })

    return <Paginator 
                page= {movementState.page}
                num_pages= {movementState.num_pages} 
                resetState={setMovementState}
                loader={loader}
                className="divide-y-[1px] divide-slate-500">
    <div className="flex">
        {modifyConcepts && <div className="px-1 shrink-0 w-14 text-center">Pago</div>}
        <div className="px-1 shrink-0 w-24 text-center">Fecha</div>
        <div className="px-1 shrink-0 w-24 text-center">Cantidad</div>
        <div className="grow px-1">Concepto</div>
    </div>
    {listOfPayments}
    </Paginator>
}


export default ListOfPayments
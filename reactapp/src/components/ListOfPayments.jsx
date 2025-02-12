import React,{useRef} from "react";
import MiniIconButton from "./MiniIconButton.jsx";
import { Link } from "react-router";
import defaultLoader from "../utils/defaultLoader.js";
import Icon from "./Icon.jsx";

const ListOfPayments = ({movementState,setMovementState,loader}) => {
    const {movements} = movementState;
    const pageInput = useRef(null);

    const listOfPayments = movements.map((each,i)=>{
        const rearrangeDate = each.date.split("-").reverse().join("/");
        const hasCardInfo = Object.keys(each).includes("cardPayment");
        const bg = hasCardInfo? (each.cardPayment?"text-emerald-700":""):(each.due>0?"":"bg-orange-200");
        return <div className={`flex bg-opacity-50 items-center ${bg}`} key={i}>
            <div className="px-1 shrink-0 w-24 text-center">{rearrangeDate}</div>
            <div className="px-1 shrink-0 w-24 text-center">{each.due>0? "$ " + each.due:"$ (" + (-each.due) + ")"}</div>
            <div className="px-1 grow overflow-hidden text-nowrap text-ellipsis">
                {each.id?
                <Link className="  hover:!text-orange-500 text-orange-700" to={`/orden/${each.id}`}>{each.concept}</Link>:
                <>{each.concept}</>
                }
            </div>
            {!each.id&&<MiniIconButton classNameExtra="me-1 shrink-0 text-black" icon="edit" onClick={()=>{}}/>}
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
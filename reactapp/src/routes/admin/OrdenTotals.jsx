import React from "react";
import MiniIconButton from "../../components/MiniIconButton.jsx";

const OrdenTotals = ({edit,prices,functions,order}) => {
 
    const othersArray = order.others.map((each,i)=>{
        return <div className="grid grid-cols-4 sm:grid-cols-6" key={`other-${i}`}>
            {edit?
            <>
                <div className="flex gap-1 items-center col-span-3 sm:col-span-5">
                    {i<order.others.length-1 && <MiniIconButton onClick={()=>functions.deleteOther(i)} icon="delete"/>}
                    <input required={i<order.others.length-1} className="!shadow-none !p-1 !rounded-none border-b-[1px] focus:border-b-2 active:border-b-2 border-slate-400" placeholder="Agrega otros conceptos aquí" onInput={functions.handleOther} name={`concept-${i}`} value={each.concept}/>
                </div>
                <input required={i<order.others.length-1} className="!shadow-none !p-1 no-arrow !rounded-none border-b-[1px] active:border-b-2 focus:border-b-2 border-slate-400" onInput={functions.handleOther} name={`price-${i}`} type="number" value={each.price}/>
            </>:
            <>
                <div className="p-1 col-span-3 sm:col-span-5">{each.concept}</div>
                <div className="p-1">$ {each.price}</div>
            </>}
        </div>
    })

    const discountArray = order.discountsApplied.map((each,i)=>{
        return <div className="grid grid-cols-4 sm:grid-cols-6" key={each.id}>
            <div className="p-1 col-span-3 sm:col-span-5">{each.text}</div>
            <div className="p-1">$ {each.value}</div>
        </div>
    })

    const listOfItems = Object.values(prices).map((each,i)=>{
        const iterable = Object.values(each.prices).filter(({id}) => Object.keys(order.orderList).includes(String(id)));
        const arrayOfThings = iterable.map((eachAgain,k)=>{
            return <div key={"item-"+k} className="grid grid-cols-4 sm:grid-cols-6">
            <div className="col-span-2 sm:col-span-4 p-1">
                {eachAgain.text}
            </div>
            <div className="p-1">{order.orderList[eachAgain.id].qty}</div>
            <div className="p-1">$ {order.orderList[eachAgain.id].qty*order.orderList[eachAgain.id].price_due}</div>
            </div>
        })

        return (arrayOfThings.length > 0 || i == 0) &&
        <div key={`section-${i}`} className="p-3 bg-white rounded-md shadow-md">
            <div className="grid grid-cols-4 sm:grid-cols-6 border-b-2 border-slate-400">
                <div className="col-span-2 sm:col-span-4 p-1 font-bold">{each.name}</div>
                <div className="col-span-1 p-1">Cantidad</div>
                <div className="col-span-1 p-1">Importe</div>
            </div>
            {arrayOfThings}
            {i == 0 && (edit || order.mediaCarga>0) && <div className="grid grid-cols-4 sm:grid-cols-6">
                {edit?<>
                    <label className="col-span-2 p-1 sm:col-span-4 flex items-center gap-1">
                        <input className="accent-sky-600" type='checkbox' checked={order.mediaCarga} name='half-load' onChange={functions.handleMediaCarga}/>Media carga?
                    </label>
                    {order.mediaCarga>0 && 
                        <><div className="p-1">1</div>
                        <div className="p-1">$ {order.mediaCarga}</div></>
                    }
                    </>:
                    <>
                        <div className="col-span-2 p-1 sm:col-span-4">Media carga</div>
                        <div className="p-1">1</div>
                        <div className="p-1">$ {order.mediaCarga}</div>
                    </>
                }
            </div>}
        </div>
    })

    const discountSum = order.discountsApplied.reduce((agg,each)=>agg+each.value,0);
    
    return <>
        {listOfItems}
        {order.others.length>0 &&
        <div className="p-3 flex flex-col bg-white rounded-md shadow-md">
            <div className="grid grid-cols-4 sm:grid-cols-6 border-b-2 border-slate-400">
                <div className="col-span-3 sm:col-span-5 p-1 font-bold">Otros</div>
                <div className="col-span-1 p-1">Importe</div>
            </div>
            {othersArray}
        </div>
        }
        {discountSum>0 &&
        <div className="p-3 flex flex-col bg-sky-200 rounded-md shadow-md">
        <div className="grid grid-cols-4 sm:grid-cols-6 border-b-2 border-sky-400">
            <div className="col-span-3 sm:col-span-5 p-1 font-bold">Concepto</div>
            <div className="col-span-1 p-1">Descuento</div>
        </div>
        {discountArray}
        </div>}
        <Total
            order={order} 
            functions={functions}
            edit={edit}
            discount={discountSum}
        /> 
    </>
}



const Total = ({order, functions, edit, discount}) => {
    const {orderList, mediaCarga, others, othersTinto} = order;

    let [total,totalTinto] = Object.values(orderList).reduce((agg,value)=>{
        return [
            agg[0] + value.qty * value.price_due, 
            agg[1] + value.qty * value.price_dryclean_due
        ];
    },[mediaCarga,0]);

    total += others.reduce((agg,each)=>agg + Number(each.price),0);

    const totalDescontado = total - discount;

    return <div className="p-3 grid grid-cols-4 sm:grid-cols-6">
        <div className="sm:col-span-3 row-span-5 text-end self-center"></div>
        {total==totalDescontado?<>
            <div className="col-span-2 p-1 text-end">Total</div>
            <div className="font-semibold p-1" >$ {total}</div>
        </>:<>
            <div className="col-span-2 line-through p-1 text-end text-sky-500">Total</div>
            <div className="font-semibold p-1 line-through text-sky-500" >$ {total}</div>
            <div className="col-span-2 p-1 text-end">Total con descuento</div>
            <div className="font-semibold p-1" >$ {totalDescontado}</div>
        </>}
        {edit && <>
        <div className="col-span-2 text-nowrap p-1 text-end text-orange-800">- Tintorería</div>
        <div className="font-semibold text-orange-700 p-1">$ {totalTinto}</div>
        {others.length>1 && <>
        <div className="col-span-2 text-nowrap p-1 text-end text-orange-800">- Tinto (otros)</div>
        <div className="p-1 flex gap-1 font-semibold text-orange-700">$ <input className="font-semibold no-arrow text-orange-700 !py-0 !px-2 !h-auto" type="number" onChange={functions.othersTintoHandle} value={othersTinto||""}/></div>  
        </>}  
        <div className="col-span-2 text-nowrap border-t-2 border-black text-end p-1">Total Neto</div>
        <div className="font-semibold border-t-2 border-black p-1">$ {totalDescontado-totalTinto-othersTinto}</div> 
        </>}
    </div>
}

export default OrdenTotals;
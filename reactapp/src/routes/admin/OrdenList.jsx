import React,{useState, useRef, useEffect} from "react";
import {useLoaderData,useNavigate} from "react-router"
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import SubMenuButton from "../../components/SubMenuButton.jsx";
import Notify from "../../components/Notify.jsx";
import OrdenTotals from "./OrdenTotals.jsx";

const OrderList = () => {
    const {order,order_list,prices,others_start,others_tinto} = useLoaderData();
    
    const priceList = Object.values(prices).reduce((prev,value)=>{
        return {...prev,...value.prices}
    },{})
    

    //Send State handling
    const [sendState,setSendState] = useState(
        {orderList: order_list,
        mediaCarga: order.has_half,
        others: [...others_start, {concept: "", price: ""}],
        othersTinto: others_tinto,
        }
    );

    const functions = () => {
        function changeOrderList (selectKey,value){
            setSendState(oldValue => {
                if(Number(value) == 0) {
                    const {[selectKey]:_, ...newItems} = oldValue.orderList;  
                    return {...oldValue,orderList:newItems};
                } else {
                    return {...oldValue,orderList:{...oldValue.orderList,
                        [selectKey]:{
                            qty:Number(value),
                            price_due:priceList[selectKey].price,
                            price_dryclean_due:priceList[selectKey].price_dryclean}}}
                }
            });
        }

        return {
            handleInputChange : (e) => {
                const {name,value} = e.target;
                const onlyNumbers = new RegExp(/^[0-9]*$/);
        
                if (onlyNumbers.test(value) && value < 100){
                    const selectKey = name.split('-')[1];
                    changeOrderList(selectKey, value);
                }
                setEdit(name.split('-')[1]);
            },
            handleChange : (e) => {
                changeOrderList(...e.target.value.split('-'));
            },
            othersTintoHandle : (e)=>{
                const {value} = e.target;
                setSendState(oldValue=>({...oldValue,othersTinto:value}));
            },
            handleOther : (e)=>{
                const {value, name, type} = e.target;
                const [key, index] = name.split('-');
                console.log(value, name, type);
                setSendState(oldValue => {
                    const onlyNumbers = new RegExp(/^[0-9]*$/);
                    console.log(oldValue.others[index].concept);
                    if (type == 'text' && oldValue.others[index].concept == "" && index == oldValue.others.length - 1){
                        return {...oldValue,
                            others: [...oldValue.others.map((each, i) => i == index? {...each, [key]: value} : each), {concept: "", price: ""}]
                        };
                    } else if (type=="text" || (onlyNumbers.test(value) && oldValue.others[index].concept !== "")){
                        return {...oldValue, others: oldValue.others.map((each, i) => i == index ? {...each, [key]: value} : each)};
                    }
                    return oldValue;
                })
            },
            deleteOther : (index)=>{setSendState(oldValue=>({...oldValue,others: oldValue.others.filter((_,i)=>i!=index)}))},
            handleMediaCarga : ()=>{setSendState(oldValue=>({...oldValue,mediaCarga:!oldValue.mediaCarga}))}
        }
    }

    console.log(functions())

    //Category handle
    const [category, setCategory] = useState(1);

    //Edit button handling
    const [edit, setEdit] = useState(null);

    const handleEditButton = (keyName) => {
        setEdit(oldValue=>oldValue==keyName?null:Number(keyName));
    };
    
    const [listMode, setListMode] = useState(false);
    const [areYouSure, setAreYouSure] = useState(false);
    
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.focus()
        }},[edit]
    );

    useEffect(()=>{
        if(sendState.others.length==1){
            setSendState(oldValue=>({...oldValue,othersTinto:0}));
        }
    },[sendState.others.length])

    


    const classNames = {};
    let qty;
    switch(category){
        case 4:
            classNames.input = "col-span-4 !h-11";
            classNames.grid = "grid gap-1 grid-cols-5";
            qty = 3;
            break;
        case 3:
            classNames.input = "col-span-6 !h-11";
            classNames.grid = "grid gap-1 grid-cols-7";
            qty = 5;
            break;
        default:
            classNames.input = "col-span-5 !h-11 md:col-span-11";
            classNames.grid = "grid gap-1 grid-cols-6 md:grid-cols-12";
            qty = 10;     
    }

    const inputs = Object.keys(prices[category].prices).map((key,i)=>{
        const value = sendState.orderList[key];

        return <div key={`input-${i}`}>
            {prices[category].prices[key].text}
            <div className={classNames.grid}>
            {edit == key || (value?.qty && value.qty > qty)?
            <InputQty inputRef={inputRef} orderListValue={value?.qty||0} keyName={key} classNames={classNames.input} onInput={functions().handleInputChange}/>:
            <Buttons orderListValue={value?.qty||0} qty={qty} orderList={sendState.orderList} keyName={key} onClick={functions().handleChange}/>
            }
            <button className="btn-back !h-11 flex items-center justify-center" onClick={()=>handleEditButton(key)}><Icon icon={edit==key?"undo":"edit"}/></button>
            </div>
        </div>;
    })

    const inputsBed = ["Sábanas","Cobertor","Edredón"].map((each,j)=>{
        const inputArray = Object.entries(prices[4].prices).filter(([_,value])=>value.text.includes(each)).map(([key,val],i)=>{
            const value = sendState.orderList[key]||{};
            const splitter = ["Sábanas de ","Cobertor-","Edredón-"];
            let title = val.text.split(splitter[j])[1];
            return <div key={`input-${val.id}`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
                <div className={classNames.grid}>
                {edit == key || (value?.qty && value.qty > qty)?
                <InputQty inputRef={inputRef} orderListValue={value.qty} keyName={key} classNames={classNames.input} onInput={functions().handleInputChange}/>:
                <Buttons orderListValue={value.qty} qty={qty} orderList={sendState.orderList} keyName={key} onClick={functions().handleChange}/>
                }
                <button className="btn-back !h-11 flex items-center justify-center" onClick={()=>handleEditButton(key)}><Icon icon={edit==key?"undo":"edit"}/></button>
                </div>
            </div>;
        });

        return <div className="relative mt-5 rounded-lg shadow-md bg-slate-200 p-3 " key={each}>
            <div className="absolute text-lg -top-4 shadow-sm px-8 left-8 rounded-lg bg-white">{each}</div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
                {inputArray}
            </div>
        </div>
    })

    

    

    //Send info

    function sendFinish(){
        // setAreYouSure(false);
        if(formRef.current.reportValidity()){
            fetcher(`/api/set_order_list/${order.id}`,()=>{setAreYouSure(true)});
        }
    }
    
    function sendReturn(){
        if(formRef.current.reportValidity()){
            fetcher(`/api/set_order_list/${order.id}`,()=>{navigate("/")});
        }
    }

    function promoteAndReturn(id){
        fetch("/api/promote_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({id:order.id})})
        .then(response=>response.json())
        .then(data=>{
        if(data.success){
            navigate("/");
        } else {
            console.log("error in promoting",id);
        }});
    }

    function fetcher(url,thenDoThis){
        fetch(url,{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(sendState)})
        .then(result => result.json())
        .then(data=>{
            if(data.success){
                thenDoThis();
            } else {
                console.log(data);
            }
        })
    }

    
    const total = Object.values(sendState.orderList).reduce((agg,value)=>{
        return agg + value.qty*value.price_due;
    },sendState.mediaCarga? 50: 0) + sendState.others.reduce((agg,each) => {
        return agg + Number(each.price);
    },0)

    const messageToSend = `Hola ${order.user.split(" ")[0]}, el total de tu orden es de $${total}. Te avisaremos cuando tu ropa esté lista. Puedes revisar más detalles en: ${location.href} `;

    return <main className="container mx-auto my-2">
            <div className="bubble-div p-4">
                <div className="flex items-center gap-1 justify-between flex-wrap">
                    <h1 className="text-orange-700">Orden de {order.user}</h1>
                    <button className="btn btn-go" onClick={()=>setListMode(current=>!current)}>{listMode?<>Agregar<Icon icon="add_circle"/></>:<>Lista<Icon icon="list"/></>}</button>
                </div>
                <b>Entrega:</b> {order.date}
                {listMode?
                <form ref={formRef} autoComplete="off" className="max-w-screen-md mt-3 mx-auto flex flex-col gap-2">
                    <OrdenTotals 
                        prices={prices} 
                        edit={true} 
                        order={sendState} 
                        functions={functions()}/>
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={sendReturn} type="button" name="save-and-return" className="flex items-center gap-1 btn-back">Guardar<Icon icon="save"/></button>
                        <button type="button" className="flex items-center gap-1 btn-go" onClick={sendFinish}>Guardar y terminar<Icon icon="shopping_cart_checkout"/></button>
                    </div>
                    <Notify 
                        show={areYouSure}
                        message={messageToSend}
                        number={order.phone}
                        backFunction={()=>setAreYouSure(false)}
                        afterFunction={promoteAndReturn}
                    />
                </form>:<>
                <div className="grid rounded-lg gap-0.5 bg-slate-300 shadow-sm overflow-hidden grid-cols-2 sm:grid-cols-4 mt-3">
                    {["local_laundry_service","iron","dry_cleaning","king_bed"].map((each,i)=>{
                        return <SubMenuButton 
                            key = {`submenu-${i}`}
                            onClick = {() => setCategory(i + 1)}
                            activeCondition = {i + 1 == category}
                            >
                            {prices[i + 1].name}
                            <Icon icon={each}/>
                            </SubMenuButton>
                    })}
                </div>
                <div className={`${category==10?"grid sm:grid-cols-2 gap-x-10 gap-y-2":"flex flex-col gap-2"} mt-3 px-2 items-stretch`}>
                    {category==4?inputsBed:inputs}
                </div>
                </>}
            </div>
            
        </main>
}


const InputQty = ({keyName,classNames,onInput,orderListValue,inputRef}) => {
    return <input 
            ref={inputRef}
            value={orderListValue || ""}
            name={`value-${keyName}`}
            id={`id-${keyName}`}
            onInput={onInput}
            className={`!rounded-md ${classNames}`}
            type="number"
        />
};

const Buttons = ({keyName,qty,onClick,orderListValue})=>{    
    const Content = [];
    for(let i = 0; i <= qty; i++) {
        Content.push(
            <button 
                className={`btn-white ${i && orderListValue == i? "choice": ""}`}
                key={`btn-${keyName}-${i}`}
                value={`${keyName}-${i}`}
                onClick={onClick}
            >
                {i}
            </button>);
    }
    return <>{Content}</>;
};


export default OrderList;

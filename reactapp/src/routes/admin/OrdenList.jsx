import React,{useState, useRef, useEffect} from "react";
import {useLoaderData,useNavigate} from "react-router"
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import ModalWarning from "../../components/ModalWarning.jsx";
import MiniIconButton from "../../components/MiniIconButton.jsx";
import SubMenuButton from "../../components/SubMenuButton.jsx";
import Notify from "../../components/Notify.jsx";

const OrderList = () => {
    const {order,order_list,prices,others_start,others_tinto} = useLoaderData();
    
    const [orderList, setOrderList] = useState(order_list);
    const [mediaCarga,setMediaCarga] = useState(order.has_half)
    const [others,setOthers] = useState([...others_start,{concept:"",price:""}]);
    const [othersTinto,setOthersTinto] = useState(others_tinto);

    const [category, setCategory] = useState(1);
    const [edit,setEdit] = useState(null);
    const [listMode,setListMode] = useState(false);
    const [areYouSure,setAreYouSure] = useState(false);
    
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.focus()
        }},[edit]
    );

    useEffect(()=>{
        if(others.length==1){
            setOthersTinto(0);
        }
    },[others.length])

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        const onlyNumbers = new RegExp(/^[0-9]*$/);

        if (onlyNumbers.test(value)&&value<100){
            setOrderList(oldValue=>{
                if(Number(value)==0){
                    const {[name.split('-')[1]]:something, ...newItems} = oldValue;  
                    return newItems;
                }
                else{
                    return {...oldValue,[name.split('-')[1]]:Number(value)}
                }
            });
        }
        setEdit(name.split('-')[1]);
    };

    const handleChange = (e) => {
        const [name,value] = e.target.value.split('-');
          
        setOrderList(oldValue=>{
            if(Number(value)==0){
                const {[name]:something, ...newItems} = oldValue;  
                return newItems;
            }
            else{
                return {...oldValue,[name]:Number(value)}
            }
        });
    };

    const handleEditButton = (keyName) => {
        setEdit(oldValue=>oldValue==keyName?null:Number(keyName));
    };

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
        const value = orderList[key];

        return <div key={`input-${i}`}>
            {prices[category].prices[key].text}
            <div className={classNames.grid}>
            {edit==key||value>qty?
            <InputQty inputRef={inputRef} orderListValue={value} keyName={key} classNames={classNames.input} onInput={handleInputChange}/>:
            <Buttons orderListValue={value} qty={qty} orderList={orderList} keyName={key} onClick={handleChange}/>
            }
            <button className="btn-back !h-11 flex items-center justify-center" onClick={()=>handleEditButton(key)}><Icon icon={edit==key?"undo":"edit"}/></button>
            </div>
        </div>;
    })

    const inputsBed = ["Sábanas","Cobertor","Edredón"].map((each,j)=>{
        const inputArray = Object.entries(prices[4].prices).filter(([_,value])=>value.text.includes(each)).map(([key,val],i)=>{
            const value = orderList[key];
            const splitter = ["Sábanas de ","Cobertor-","Edredón-"];

            let title = val.text.split(splitter[j])[1];

            return <div key={`input-${val.id}`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
                <div className={classNames.grid}>
                {edit==key||value>qty?
                <InputQty inputRef={inputRef} orderListValue={value} keyName={key} classNames={classNames.input} onInput={handleInputChange}/>:
                <Buttons orderListValue={value} qty={qty} orderList={orderList} keyName={key} onClick={handleChange}/>
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

    

    const listOfItems = Object.values(prices).map((each,i)=>{
        const iterable = Object.values(each.prices).filter(eachAgain=>Object.keys(orderList).includes(String(eachAgain.id)));
        const arrayOfThings = iterable.map((eachAgain,k)=>{
            return <div key={"item-"+k} className="grid grid-cols-4 sm:grid-cols-6">
            <div className="col-span-2 sm:col-span-4 p-1">
                {eachAgain.text}
            </div>
            <div className="p-1">{orderList[eachAgain.id]}</div>
            <div className="p-1">$ {orderList[eachAgain.id]*eachAgain.price}</div>
            </div>
        })

        console.log("calculating prices?")


        return (arrayOfThings.length>0||i==0) &&
        <div key={`section-${i}`} className="p-3 bg-white rounded-md shadow-md">
            <div className="grid grid-cols-4 sm:grid-cols-6 border-b-2 border-slate-400">
                <div className="col-span-2 sm:col-span-4 p-1 font-bold">{each.name}</div>
                <div className="col-span-1 p-1">Cantidad</div>
                <div className="col-span-1 p-1">Importe</div>
            </div>
            {arrayOfThings}
            {i==0 && <div className="grid grid-cols-4 sm:grid-cols-6">
                <label className="col-span-2 p-1 sm:col-span-4 flex items-center gap-1"><input className="accent-sky-600" type='checkbox' checked={mediaCarga} name='half-load' onChange={()=>setMediaCarga(oldValue=>!oldValue)}/>Media carga?</label>
                {mediaCarga && <><div className="p-1">1</div><div className="p-1">$ 50</div></>}
            </div>}
        </div>
    })

    function othersTintoHandle(e) {
        const {value} = e.target;
        setOthersTinto(value);
    }

    
    

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
            body:JSON.stringify({order_list:orderList,has_half:mediaCarga,others:others,othersTinto:othersTinto})})
        .then(result => result.json())
        .then(data=>{
            if(data.success){
                thenDoThis();
            } else {
                console.log(data);
            }
        })
    }


    function handleOther(e){
        const {value,name,type} = e.target;
        const [key,index] = name.split('-');
        console.log(value,name,type);
        setOthers(oldValue=>{
            const onlyNumbers = new RegExp(/^[0-9]*$/);
            console.log(oldValue[index].concept);
            if (type=='text' && oldValue[index].concept=="" && index==oldValue.length-1){
                return [...oldValue.map((each,i)=>i==index?{...each,[key]:value}:each),{concept:"",price:""}]
            } else if (type=="text"||(onlyNumbers.test(value)&&oldValue[index].concept!=="")){
                return oldValue.map((each,i)=>i==index?{...each,[key]:value}:each);
            }
            return oldValue;
        })
    }

    function deleteOther(index){
        setOthers(oldValue=>oldValue.filter((_,i)=>i!=index))
        console.log(others);

    }

    const othersArray = others.map((each,i)=>{
        return <div className="grid gap-3 grid-cols-4 sm:grid-cols-6" key={`other-${i}`}>
            <div className="flex gap-1 items-center col-span-3 sm:col-span-5">
                {i<others.length-1 && <MiniIconButton onClick={()=>deleteOther(i)} icon="delete"/>}
                <input required={i<others.length-1} className="!shadow-none !p-1 !rounded-none border-b-[1px] focus:border-b-2 active:border-b-2 border-slate-400" placeholder="Agrega otros conceptos aquí" onInput={handleOther} name={`concept-${i}`} value={each.concept}/>
            </div>
            <input required={i<others.length-1} className="!shadow-none !p-1 no-arrow !rounded-none border-b-[1px] active:border-b-2 focus:border-b-2 border-slate-400" onInput={handleOther} name={`price-${i}`} type="number" value={each.price}/>
        </div>
    })

    const priceList = Object.values(prices).reduce((prev,value)=>{
        return {...prev,...value.prices}
    },{})
    
    let total = mediaCarga? 50: 0;
    Object.entries(orderList).forEach(([key,value])=>{
        total += value*priceList[key].price;
    })

    others.forEach(each=>{
        total += Number(each.price);
    })

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
                    {listOfItems}
                    <div className="p-3 flex flex-col bg-white rounded-md shadow-md">
                        <div className="grid grid-cols-4 sm:grid-cols-6 border-b-2 border-slate-400">
                            <div className="col-span-3 sm:col-span-5 p-1 font-bold">Otros</div>
                            <div className="col-span-1 p-1">Importe</div>
                        </div>
                        {othersArray}
                    </div>
                    <Total 
                        prices={prices} 
                        othersTinto={othersTinto} 
                        othersTintoHandle={othersTintoHandle} 
                        mediaCarga={mediaCarga} 
                        orderList={orderList} 
                        others={others}
                    /> 
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


const Total = ({prices, orderList, mediaCarga, others, othersTinto, othersTintoHandle}) => {
    const priceList = Object.values(prices).reduce((prev,value)=>{
        return {...prev,...value.prices}
    },{})

    console.log("calculating total")

    let total = mediaCarga? 50: 0;
    let totalTinto = 0;

    Object.entries(orderList).forEach(([key,value])=>{
        total += value*priceList[key].price;
        totalTinto += value*priceList[key].price_dryclean;
    })

    others.forEach(each=>{
        total += Number(each.price);
    })


    return <div className="p-3 grid grid-cols-4 sm:grid-cols-6">
        <div className={`col-span-1 sm:col-span-4 ${others.length>1?"row-span-4":"row-span-3"} text-end self-center`}></div>
        <div className="col-span-2 sm:col-span-1 p-1 text-end">Total</div>
        <div className="font-semibold p-1" >$ {total}</div>
        <div className="col-span-2 sm:col-span-1 text-nowrap p-1 text-end text-orange-800">- Tintorería</div>
        <div className="font-semibold text-orange-700 p-1">$ {totalTinto}</div>
        {others.length>1 && <>
        <div className="col-span-2 sm:col-span-1 text-nowrap p-1 text-end text-orange-800">- Tinto (otros)</div>
        <div className="p-1 flex gap-1 font-semibold text-orange-700">$ <input className="font-semibold no-arrow text-orange-700 !py-0 !px-2 !h-auto" type="number" onChange={othersTintoHandle} value={othersTinto||""}/></div>  
        </>}   
        <div className="col-span-2 sm:col-span-1 text-nowrap border-t-2 border-black text-end p-1">Total Neto</div>
        <div className="font-semibold border-t-2 border-black p-1">$ {total-totalTinto-othersTinto}</div>
    </div>
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
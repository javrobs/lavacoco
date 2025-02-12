import React, {useState} from "react";
import {useLoaderData, useNavigate} from "react-router"
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";

const Payment = () => {
    const loader = useLoaderData();
    const [payment,setPayment] = useState("");
    const navigate = useNavigate();


    console.log(loader);

    const submit = (e) => {
        e.preventDefault();
        fetch("/api/save_payment_and_continue/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({id:loader.order.id,payment:payment})
        }).then(response=>response.json())
        .then(data=>{
            if(data.success){
                console.log(data);
                navigate("/");
            }
        })
    }

    function selectPayment({target}){
        const {value} = target;
        setPayment(value);
    }

    return <form className="bubble-div p-4" onSubmit={submit}>
        <div className="flex gap-2 flex-wrap">
            <h2>Método de pago</h2>
            <label className={`${payment=="efectivo"?"bg-sky-200 text-sky-700":"hover:bg-sky-100"}  rounded-md px-2 flex ms-auto items-center gap-1`}>
                <input className="accent-sky-700" type="radio" name="payment" value="efectivo" onChange={selectPayment} checked={payment=="efectivo"} required={true}/>
                <Icon icon="payments"/>
                Efectivo
            </label>
            <label className={`${payment=="tarjeta"?"bg-sky-200 text-sky-700":"hover:bg-sky-100"}  rounded-md px-2 flex items-center gap-1`}>
                <input className="accent-sky-700" type="radio" name="payment" value="tarjeta" onChange={selectPayment} checked={payment=="tarjeta"} required={true}/>
                <Icon icon="credit_card"/>
                Transferencia
            </label>
        </div>
        <button className="btn mx-auto btn-go mt-2">Finalizar<Icon icon="check"/></button>
    </form>
}


export default Payment;


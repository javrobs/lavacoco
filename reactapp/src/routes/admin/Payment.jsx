import React, {useState} from "react";
import {useLoaderData, useNavigate} from "react-router";
import Icon from "../../components/Icon.jsx";
import defaultPost from "../../utils/defaultPost.js"

const Payment = () => {
    const loader = useLoaderData();
    const [payment,setPayment] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const data = await defaultPost("/api/save_payment_and_continue/",{id:loader.order.id,payment:payment})
        if(data.success){
            navigate("/");
        }
    }

    function selectPayment({target}){
        setPayment(target.value);
    }

    return <form className="bubble-div p-4" onSubmit={submit}>
        <div className="flex gap-2 flex-wrap">
            <h2>Método de pago</h2>
            <label className={`${payment=="efectivo"?"bg-blue-200 text-blue-700":"hover:bg-blue-100"}  rounded-md px-2 flex ms-auto items-center gap-1`}>
                <input className="accent-blue-700" type="radio" name="payment" value="efectivo" onChange={selectPayment} checked={payment=="efectivo"} required={true}/>
                <Icon icon="point_of_sale"/>
                Caja
            </label>
            <label className={`${payment=="tarjeta"?"bg-orange-200 text-orange-700":"hover:bg-orange-100"}  rounded-md px-2 flex items-center gap-1`}>
                <input className="accent-orange-700" type="radio" name="payment" value="tarjeta" onChange={selectPayment} checked={payment=="tarjeta"} required={true}/>
                <Icon icon="credit_card"/>
                Transferencia
            </label>
        </div>
        <button className="btn mx-auto btn-go mt-2">Finalizar<Icon icon="check"/></button>
    </form>
}


export default Payment;


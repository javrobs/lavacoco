import React, {useState, useRef, useContext} from "react"
import { userContext } from "../components/App.jsx"
import {useNavigate} from "react-router"
import Header from "../components/Header.jsx"
import Icon from "../components/Icon.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import cookieCutter from "../utils/cookieCutter.js"

export default function Signup(){
    const [signupState,setSignupState] = useState({})
    const [signupFailed,setSignupFailedState] = useState(false)
    const pw2 = useRef(null);
    const pw = useRef(null);
    const [extendAddressForm,setExtendAddressForm] = useState(false);
    const navigate = useNavigate();
    const {refreshFunction} = useContext(userContext);

    function toggleAddressForm(e){
        setExtendAddressForm(value=>value==false);
    }

    function verifyPW(e){
        const {value} = e.target;
        handleChange(e);
        pw2.current.setCustomValidity(signupState.pw2 != value?'Las contraseñas no coinciden':"");
        // pw.current.setCustomValidity(value.length<8?'La contraseña debe tener 8 caracteres':"")
    }

    function verifyPW2(e){
        const {value} = e.target;
        handleChange(e);
        pw2.current.setCustomValidity(signupState.pw != value?'Las contraseñas no coinciden':"");  
    }
    
    
    function handleChange(e){
        const {name,value} = e.target;
        setSignupState(oldState=>({...oldState,[name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(e);
        fetch("api/signup",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(signupState)
        }).then(response=>{
            console.log(response);
            if(response.ok){
                refreshFunction();
                navigate('/');
            } else {
                setSignupFailedState(response.statusText)
            }
        });
    }

    console.log(signupState)

    return <>
        <Header/>
        <form className="flex max-w-lg mx-auto flex-col gap-y-3 p-3 px-5 my-3 rounded-xl bubble-div justify-center text-center" onSubmit={handleSubmit}>
        <h1 className="text-center text-orange-700">Regístrate</h1>
        <p className='text-blue-800 text-left'>Lleva seguimiento de tus órdenes y accede al programa de cliente frecuente.</p>
        <div className="flex flex-wrap gap-y-2 mx-6">
        <ErrorMessage errorContent={signupFailed}/>
        <label className="inputLabel mx-0 grow px-1">
            <input required value={signupState.phone} onInput={handleChange} name="phone" type="tel"/>
            <span>Teléfono</span>
        </label>
        <label className="inputLabel mx-0 w-1/2 px-1">
            <input required value={signupState.name} onInput={handleChange} name="name"/>
            <span>Nombre</span>
        </label>
        <label className="inputLabel mx-0 w-1/2 px-1">
            <input required value={signupState.lastname} onInput={handleChange} name="lastname" />
            <span>Apellido</span>
        </label>
        <label className="inputLabel mx-0 w-1/2 px-1">
            <input required ref={pw} value={signupState.pw} onInput={verifyPW} name="pw" type="password" minLength={8}/>
            <span>Contraseña</span>
        </label>
        <label className="inputLabel mx-0 w-1/2 px-1">
            <input required ref={pw2} value={signupState.pw2} onInput={verifyPW2} name="pw2" type="password" />
            <span>Repite la contraseña</span>
        </label>
        
        </div>
        <label className="text-blue-800">
            <input value={extendAddressForm} onClick={toggleAddressForm} className="accent-blue-300" type='checkbox'/>
            <span className="text-start">Quiero proporcionar mi dirección para entregas a domicilio, si están disponibles en mi zona. (Opcional)</span>
        </label>
        {extendAddressForm&&
        <fieldset className="flex flex-col items gap-2">
            <legend className="text-start text-lg">Dirección</legend>
            <div className="flex flex-wrap gap-y-2 mx-6">
                <label className='inputLabel grow px-1 mx-0'>
                    <input required value={signupState.addressStreet} onInput={handleChange} name="addressStreet"/>
                    <span>Calle</span>
                </label>
                <label className='inputLabel mx-0 w-1/2 px-1'>
                    <input required value={signupState.addressNumberExt} onInput={handleChange} name="addressNumberExt" type='number' min={0} step="1"/>
                    <span># Externo</span>
                </label>
                <label className='inputLabel mx-0 w-1/2 px-1'>
                    <input value={signupState.addressNumberInt} onInput={handleChange} name="addressNumberInt" type='number' min={0} step="1"/>
                    <span># Interno*</span>
                </label>
                <label className='inputLabel mx-0 w-1/2 px-1'>
                    <input required value={signupState.addressColonia} onInput={handleChange} name="addressColonia"/>
                    <span>Colonia</span>
                </label>
                <label className='inputLabel mx-0 w-1/2 px-1'>
                    <input value={signupState.addressCP} onInput={handleChange} name="addressCP" pattern="[0-9]{5}" />
                    <span>Código Postal*</span>
                </label>
                <span>* = opcional</span>
            </div>
        </fieldset>}
        <button className="btn-go btn self-center">Continuar<Icon icon='arrow_forward'/></button>
    </form>
    </>
}